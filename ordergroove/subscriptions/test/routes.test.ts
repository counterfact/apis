import assert from "node:assert/strict";
import net from "node:net";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { counterfact } from "counterfact";

const basePath = fileURLToPath(new URL("../../", import.meta.url));
const openApiPath = fileURLToPath(
  new URL("../../openapi/subscriptions.yml", import.meta.url),
);
const specifications = [
  "customers",
  "items",
  "offers",
  "orders",
  "products",
  "subscriptions",
].map((group) => ({
  source: fileURLToPath(new URL(`../../openapi/${group}.yml`, import.meta.url)),
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
      const response = await request("/subscriptions/");
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

test("requires a valid API key", async () => {
  const missing = await fetch(`http://127.0.0.1:${port}/subscriptions/`);
  assert.equal(missing.status, 401);
  assert.deepEqual(await missing.json(), { error: "Unauthorized" });

  const invalid = await request("/subscriptions/", {
    headers: { "x-api-key": "invalid" },
  });
  assert.equal(invalid.status, 401);
});

test("lists deterministic subscriptions and applies every documented filter", async () => {
  const response = await request("/subscriptions/");
  assert.equal(response.status, 200);
  const body = await response.json();
  assert.deepEqual(
    body.results.map(({ public_id }: { public_id: string }) => public_id),
    ["subscription-001", "subscription-002"],
  );
  assert.equal(body.results[0].customer_id, "customer-001");
  assert.equal(body.results[0].product_id, "product-001");

  for (const [query, expected] of [
    ["customer=customer-001", ["subscription-001"]],
    ["product=product-002", ["subscription-002"]],
    ["live=false", ["subscription-002"]],
    ["created_start=2026-02-01", ["subscription-002"]],
    ["created_end=2026-01-31", ["subscription-001"]],
  ] as const) {
    const filtered = await request(`/subscriptions/?${query}`);
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

test("retrieves, replaces, and persists a subscription", async () => {
  const retrieveResponse = await request("/subscriptions/subscription-001/");
  assert.equal(retrieveResponse.status, 200);
  assert.equal((await retrieveResponse.json()).quantity, 1);

  const updateResponse = await request("/subscriptions/subscription-001/", {
    method: "PUT",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      id: "ignored-id",
      public_id: "ignored-public-id",
      customer_id: "customer-002",
      product_id: "product-002",
      quantity: 3,
      every: 4,
      every_period: "week",
      live: true,
    }),
  });
  assert.equal(updateResponse.status, 200);
  assert.deepEqual(await updateResponse.json(), {
    id: "subscription-internal-001",
    public_id: "subscription-001",
    customer_id: "customer-002",
    product_id: "product-002",
    quantity: 3,
    every: 4,
    every_period: "week",
    live: true,
  });
  const persisted = await request("/subscriptions/subscription-001/");
  assert.equal(persisted.status, 200);
  assert.equal((await persisted.json()).quantity, 3);
});

test("persists cancellation, reactivation, and frequency changes", async () => {
  const cancel = await request("/subscriptions/subscription-001/cancel/", {
    method: "POST",
  });
  assert.equal(cancel.status, 200);
  assert.equal((await cancel.json()).live, false);
  const persistedCancel = await request("/subscriptions/subscription-001/");
  assert.equal((await persistedCancel.json()).live, false);

  const reactivate = await request(
    "/subscriptions/subscription-001/reactivate/",
    { method: "POST" },
  );
  assert.equal(reactivate.status, 200);
  assert.equal((await reactivate.json()).live, true);

  const frequency = await request(
    "/subscriptions/subscription-001/change_frequency/",
    {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ every: 2, every_period: "year" }),
    },
  );
  assert.equal(frequency.status, 200);
  assert.equal((await frequency.json()).every, 2);
  const persistedFrequency = await request("/subscriptions/subscription-001/");
  assert.equal((await persistedFrequency.json()).every_period, "year");
});

test("returns 404 for every operation on unknown subscriptions", async () => {
  const operations: Array<[string, RequestInit]> = [
    ["/subscriptions/not-found/", {}],
    [
      "/subscriptions/not-found/",
      {
        method: "PUT",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ quantity: 1 }),
      },
    ],
    ["/subscriptions/not-found/cancel/", { method: "POST" }],
    ["/subscriptions/not-found/reactivate/", { method: "POST" }],
    [
      "/subscriptions/not-found/change_frequency/",
      {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ every: 1, every_period: "month" }),
      },
    ],
  ];

  for (const [pathname, init] of operations) {
    const response = await request(pathname, init);
    assert.equal(response.status, 404, pathname);
    assert.deepEqual(await response.json(), {
      error: "Subscription not found",
    });
  }
});
