import assert from "node:assert/strict";
import net from "node:net";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { counterfact } from "counterfact";
import { order } from "../domain/fixtures.js";
import { Context } from "../routes/_.context.js";
import { happyPath } from "../scenarios/index.js";
import type { Customer } from "../types/components/schemas/Customer.js";
import type { OrderPage } from "../types/components/schemas/OrderPage.js";
import type { SubscriptionPage } from "../types/components/schemas/SubscriptionPage.js";
import type { Scenario$ } from "../types/_.context.js";

const basePath = fileURLToPath(new URL("../", import.meta.url));
const openApiPath = fileURLToPath(new URL("../openapi.yaml", import.meta.url));
const apiKey = "ordergroove-simulator-key";

let port: number;
let server: { stop(): Promise<void> } | undefined;
let context: Context;

const request = (pathname: string, apiKeyOverride: string | null = apiKey) =>
  fetch(`http://127.0.0.1:${port}${pathname}`, {
    headers: apiKeyOverride === null ? {} : { "x-api-key": apiKeyOverride },
  });

const getFreePort = async () =>
  new Promise<number>((resolve, reject) => {
    const temporaryServer = net.createServer();
    temporaryServer.listen(0, "127.0.0.1", () => {
      const address = temporaryServer.address();
      if (address && typeof address === "object") resolve(address.port);
      else reject(new Error("failed to determine free port"));
      temporaryServer.close();
    });
    temporaryServer.on("error", reject);
  });

const waitForServer = async () => {
  for (let attempt = 0; attempt < 60; attempt += 1) {
    try {
      const response = await request("/customers/customer_demo/");
      if (response.status === 200) return;
    } catch {
      // Server startup races are expected here.
    }
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
  throw new Error("counterfact server did not start in time");
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

  const app = await counterfact(config);
  server = await app.start(config);
  context = app.contextRegistry.find("/") as Context;
  happyPath({
    context,
    loadContext: (path: string) => app.contextRegistry.find(path),
    route: () => ({}),
    routes: {},
  } as unknown as Scenario$);
  await waitForServer();
});

test.after(async () => {
  await server?.stop();
});

test("rejects missing and invalid simulator credentials", async () => {
  for (const credential of [null, "not-the-simulator-key"]) {
    const response = await request("/customers/customer_demo/", credential);
    assert.equal(response.status, 403);
    assert.deepEqual(await response.json(), {
      detail: "Authentication Failed",
    });
  }
});

test("supports the customer to subscription to order workflow", async () => {
  const customerResponse = await request("/customers/customer_demo/");
  assert.equal(customerResponse.status, 200);
  const customer = (await customerResponse.json()) as Customer;
  assert.equal(customer.merchant_user_id, "customer_demo");

  const subscriptionResponse = await request(
    "/subscriptions/?customer=customer_demo",
  );
  assert.equal(subscriptionResponse.status, 200);
  const subscriptions = (await subscriptionResponse.json()) as SubscriptionPage;
  assert.equal(subscriptions.results.length, 1);
  assert.equal(subscriptions.results[0].public_id, "subscription_demo");

  const ordersResponse = await request(
    "/orders/?subscription=subscription_demo",
  );
  assert.equal(ordersResponse.status, 200);
  const orders = (await ordersResponse.json()) as OrderPage;
  assert.equal(orders.results.length, 1);
  assert.equal(orders.results[0].public_id, "order_upcoming");
});

test("retrieve handlers return contract-shaped not found errors", async () => {
  for (const pathname of [
    "/customers/missing/",
    "/subscriptions/missing/",
    "/orders/missing/",
  ]) {
    const response = await request(pathname);
    assert.equal(response.status, 404);
    assert.deepEqual(await response.json(), {
      detail: "Unable to find requested asset.",
    });
  }
});

test("pagination is deterministic and links stay on the local origin", async () => {
  context.state.orders.push(
    order({ public_id: "order_second", place: "2026-10-01" }),
  );

  const firstResponse = await request(
    "/orders/?customer=customer_demo&page_size=1",
  );
  const first = (await firstResponse.json()) as OrderPage;
  assert.equal(first.results[0].public_id, "order_upcoming");
  assert.ok(first.next);
  assert.match(first.next, new RegExp(`^http://127\\.0\\.0\\.1:${port}/orders/`));
  assert.equal(first.next.includes("restapi.ordergroove.com"), false);

  const nextUrl = new URL(first.next);
  const secondResponse = await request(`${nextUrl.pathname}${nextUrl.search}`);
  const second = (await secondResponse.json()) as OrderPage;
  assert.equal(second.results[0].public_id, "order_second");
  assert.notEqual(second.previous, null);

  happyPath({
    context,
    loadContext: () => context,
    route: () => ({}),
    routes: {},
  } as unknown as Scenario$);
  assert.equal(context.state.orders.length, 1);
});
