import assert from "node:assert/strict";
import net from "node:net";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { counterfact } from "counterfact";
import type { Store } from "../_.store.ts";

const basePath = fileURLToPath(new URL("../", import.meta.url));
const groups = [
  "customers",
  "items",
  "offers",
  "orders",
  "products",
  "subscriptions",
] as const;
const specifications = groups.map((group) => ({
  source: fileURLToPath(new URL(`../openapi/${group}.yml`, import.meta.url)),
  group,
  prefix: "",
}));
const apiKey = "ordergroove-local-api-key";

let port: number;
let server: { stop(): Promise<void> } | undefined;
let store: Store;

const request = (pathname: string) =>
  fetch(`http://127.0.0.1:${port}${pathname}`, {
    headers: { "x-api-key": apiKey },
  });

const getFreePort = async () =>
  new Promise<number>((resolve, reject) => {
    const temporaryServer = net.createServer();
    temporaryServer.listen(0, "127.0.0.1", () => {
      const address = temporaryServer.address();
      if (address && typeof address === "object") {
        resolve(address.port);
      } else {
        reject(new Error("failed to determine a free port"));
      }
      temporaryServer.close();
    });
    temporaryServer.on("error", reject);
  });

const waitForServer = async () => {
  for (let attempt = 0; attempt < 60; attempt += 1) {
    try {
      const response = await request("/customers/");
      if (response.ok) return;
    } catch {
      // The listener may not be ready yet.
    }
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
  throw new Error("Counterfact server did not start in time");
};

test.before(async () => {
  port = await getFreePort();
  const config = {
    adminApiToken: "",
    alwaysFakeOptionals: false,
    basePath,
    buildCache: false,
    generate: { prune: false, routes: false, types: false },
    openApiPath: specifications[0].source,
    port,
    prefix: "",
    proxyPaths: new Map([["", false]]),
    proxyUrl: "",
    startAdminApi: false,
    startRepl: false,
    startServer: true,
    validateRequests: true,
    validateResponses: true,
    watch: { routes: false, types: false },
  };

  const app = await counterfact<Store>(config, specifications);
  assert.ok(app.store, "Counterfact should discover the Ordergroove Store");
  store = app.store;
  server = await app.start(config);
  await waitForServer();
});

test.after(async () => {
  await server?.stop();
});

test("customers and orders observe mutations to the simulator's one shared Store", async () => {
  store.seedCustomers([
    {
      id: "customer-internal-shared",
      public_id: "customer-shared",
      merchant_id: "merchant-shared",
      merchant_user_id: "user-shared",
      first_name: "Shared",
      last_name: "Customer",
      email: "shared@example.com",
    },
  ]);
  store.seedOrders([
    {
      id: "order-internal-shared",
      public_id: "order-shared",
      customer_id: "customer-shared",
      place: "2026-08-01T12:00:00Z",
      status: "unsent",
      sub_total: "20.00",
      shipping_total: "2.00",
      total: "22.00",
      order_merchant_id: "merchant-order-shared",
      payment_id: "payment-shared",
      shipping_address_id: "address-shared",
    },
  ]);

  const [customersResponse, ordersResponse] = await Promise.all([
    request("/customers/"),
    request("/orders/"),
  ]);

  assert.equal(customersResponse.status, 200);
  assert.equal(ordersResponse.status, 200);
  assert.deepEqual(
    (
      (await customersResponse.json()) as { results: { public_id?: string }[] }
    ).results.map(({ public_id }) => public_id),
    ["customer-shared"],
  );
  assert.deepEqual(
    (
      (await ordersResponse.json()) as { results: { public_id?: string }[] }
    ).results.map(({ public_id }) => public_id),
    ["order-shared"],
  );
});
