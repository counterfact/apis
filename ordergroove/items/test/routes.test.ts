import assert from "node:assert/strict";
import net from "node:net";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { counterfact } from "counterfact";

const basePath = fileURLToPath(new URL("../../", import.meta.url));
const openApiPath = fileURLToPath(
  new URL("../../openapi/upstream/items.yml", import.meta.url),
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
      const response = await request("/items/");
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

test("requires a valid API key for collection and detail operations", async () => {
  for (const [pathname, method, body] of [
    ["/items/", "GET", undefined],
    ["/items/", "POST", JSON.stringify({ product_id: "product-001" })],
    ["/items/item-001/", "GET", undefined],
    ["/items/item-001/", "DELETE", undefined],
  ] as const) {
    const response = await fetch(`http://127.0.0.1:${port}${pathname}`, {
      method,
      body,
      headers: body ? { "content-type": "application/json" } : undefined,
    });
    assert.equal(response.status, 401, `${method} ${pathname}`);
    assert.deepEqual(await response.json(), { error: "Unauthorized" });
  }
});

test("lists coherent deterministic items and filters by subscription and order", async () => {
  const response = await request("/items/");
  assert.equal(response.status, 200);
  const body = await response.json();
  assert.deepEqual(
    body.results.map(({ public_id }: { public_id: string }) => public_id),
    ["item-001", "item-002"],
  );
  assert.equal(body.results[0].subscription_id, "subscription-001");
  assert.equal(body.results[0].order_id, "order-001");
  assert.equal(body.results[0].product_id, "product-001");

  for (const [query, expected] of [
    ["subscription=subscription-001", ["item-001"]],
    ["order=order-002", ["item-002"]],
    ["subscription=subscription-001&order=order-002", []],
  ] as const) {
    const filtered = await request(`/items/?${query}`);
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

test("retrieves an item", async () => {
  const response = await request("/items/item-001/");
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), {
    id: "item-internal-001",
    public_id: "item-001",
    order_id: "order-001",
    subscription_id: "subscription-001",
    product_id: "product-001",
    quantity: 1,
    price: "19.99",
    total_price: "19.99",
    offer_id: "offer-profile-001",
    one_time: false,
  });
});

test("creates an item and persists it", async () => {
  const input = {
    order_id: "order-001",
    subscription_id: "subscription-001",
    product_id: "product-002",
    quantity: 3,
    price: "12.50",
    total_price: "37.50",
    offer_id: "offer-profile-001",
    one_time: true,
  };
  const response = await request("/items/", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(input),
  });
  assert.equal(response.status, 201);
  const created = await response.json();
  assert.deepEqual(created, {
    ...input,
    id: "item-internal-003",
    public_id: "item-003",
  });

  const persisted = await request("/items/item-003/");
  assert.equal(persisted.status, 200);
  assert.deepEqual(await persisted.json(), created);
});

test("deletes an item with an empty 204 response and persists deletion", async () => {
  const response = await request("/items/item-002/", { method: "DELETE" });
  assert.equal(response.status, 204);
  assert.equal(await response.text(), "");

  const persisted = await request("/items/item-002/");
  assert.equal(persisted.status, 404);
  assert.deepEqual(await persisted.json(), { error: "Item not found" });
});

test("returns 404 for retrieve and delete on unknown items", async () => {
  const retrieve = await request("/items/not-found/");
  assert.equal(retrieve.status, 404);
  assert.deepEqual(await retrieve.json(), { error: "Item not found" });

  const deletion = await request("/items/not-found/", { method: "DELETE" });
  assert.equal(deletion.status, 404);
  assert.deepEqual(await deletion.json(), { error: "Item not found" });
});
