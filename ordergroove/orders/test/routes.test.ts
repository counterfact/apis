import assert from "node:assert/strict";
import net from "node:net";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { counterfact } from "counterfact";

const basePath = fileURLToPath(new URL("../../", import.meta.url));
const openApiPath = fileURLToPath(
  new URL("../../openapi/upstream/orders.yml", import.meta.url),
);
const specifications = [
  "customers",
  "items",
  "offers",
  "orders",
  "products",
  "subscriptions",
].map((group) => ({
  source: fileURLToPath(
    new URL(`../../openapi/upstream/${group}.yml`, import.meta.url),
  ),
  group,
  prefix: "",
}));
const apiKey = "ordergroove-local-api-key";

let port: number;
let server: { stop(): Promise<void> } | undefined;

const request = (pathname: string, init: RequestInit = {}) =>
  fetch(`http://127.0.0.1:${port}${pathname}`, {
    ...init,
    headers: { "x-api-key": apiKey, ...init.headers },
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
      const response = await request("/orders/");
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
    openApiPath,
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

  const app = await counterfact(config, specifications);
  server = await app.start(config);
  await waitForServer();
});

test.after(async () => {
  await server?.stop();
});

test("requires a valid API key for collection, detail, and actions", async () => {
  for (const [pathname, method] of [
    ["/orders/", "GET"],
    ["/orders/order-001/", "GET"],
    ["/orders/order-001/cancel/", "POST"],
    ["/orders/order-001/send_now/", "POST"],
  ] as const) {
    const response = await fetch(`http://127.0.0.1:${port}${pathname}`, {
      method,
    });
    assert.equal(response.status, 401, pathname);
    assert.deepEqual(await response.json(), { error: "Unauthorized" });
  }
});

test("lists deterministic orders and filters by customer and status", async () => {
  const response = await request("/orders/");
  assert.equal(response.status, 200);
  const body = await response.json();
  assert.deepEqual(
    body.results.map(({ public_id }: { public_id: string }) => public_id),
    ["order-001", "order-002"],
  );
  assert.equal(body.results[0].customer_id, "customer-001");
  assert.equal(body.results[1].customer_id, "customer-002");

  for (const [query, expected] of [
    ["customer=customer-001", ["order-001"]],
    ["status=success", ["order-002"]],
    ["customer=customer-001&status=success", []],
  ] as const) {
    const filtered = await request(`/orders/?${query}`);
    assert.equal(filtered.status, 200);
    assert.deepEqual(
      (await filtered.json()).results.map(
        ({ public_id }: { public_id: string }) => public_id,
      ),
      expected,
      query,
    );
  }
});

test("retrieves an order", async () => {
  const response = await request("/orders/order-001/");
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), {
    id: "order-internal-001",
    public_id: "order-001",
    customer_id: "customer-001",
    place: "2026-03-15T12:00:00Z",
    status: "unsent",
    sub_total: "25.00",
    shipping_total: "2.00",
    total: "27.00",
    order_merchant_id: "merchant-order-001",
    payment_id: "payment-001",
    shipping_address_id: "address-001",
  });
});

test("cancels an order and persists the transition", async () => {
  const response = await request("/orders/order-002/cancel/", {
    method: "POST",
  });
  assert.equal(response.status, 200);
  assert.equal((await response.json()).status, "cancelled");

  const persisted = await request("/orders/order-002/");
  assert.equal(persisted.status, 200);
  assert.equal((await persisted.json()).status, "cancelled");
});

test("sends an order now and persists its immediate pending state", async () => {
  const response = await request("/orders/order-001/send_now/", {
    method: "POST",
  });
  assert.equal(response.status, 200);
  const sent = await response.json();
  assert.equal(sent.status, "pending");
  assert.notEqual(sent.place, "2026-03-15T12:00:00Z");
  assert.equal(Number.isNaN(Date.parse(sent.place)), false);

  const persisted = await request("/orders/order-001/");
  assert.equal(persisted.status, 200);
  assert.equal((await persisted.json()).place, sent.place);
});

test("returns 404 for every operation on unknown orders", async () => {
  for (const [pathname, method] of [
    ["/orders/not-found/", "GET"],
    ["/orders/not-found/cancel/", "POST"],
    ["/orders/not-found/send_now/", "POST"],
  ] as const) {
    const response = await request(pathname, { method });
    assert.equal(response.status, 404, pathname);
    assert.deepEqual(await response.json(), { error: "Order not found" });
  }
});
