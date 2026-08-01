import assert from "node:assert/strict";
import net from "node:net";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { counterfact } from "counterfact";

const basePath = fileURLToPath(new URL("../../", import.meta.url));
const openApiPath = fileURLToPath(
  new URL("../../openapi/upstream/offers.yml", import.meta.url),
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
      const response = await request("/offer_profiles/");
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
  const missing = await fetch(`http://127.0.0.1:${port}/offer_profiles/`);
  assert.equal(missing.status, 401);
  assert.deepEqual(await missing.json(), { error: "Unauthorized" });

  const invalid = await request("/entitlements/", {
    headers: { "x-api-key": "invalid" },
  });
  assert.equal(invalid.status, 401);
});

test("lists deterministic startup offer profiles", async () => {
  const response = await request("/offer_profiles/");
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), {
    results: [
      {
        id: "offer-profile-001",
        name: "Subscribe and save",
        description: "Save 10% on recurring deliveries",
      },
      {
        id: "offer-profile-002",
        name: "VIP subscriber",
        description: "Preferred pricing for VIP subscribers",
      },
    ],
  });
});

test("lists and persists created one-time discounts", async () => {
  const initial = await request("/otd/");
  assert.equal(initial.status, 200);
  assert.deepEqual(await initial.json(), {
    results: [
      {
        id: "discount-001",
        customer_id: "customer-001",
        amount: "5.00",
        type: "fixed",
      },
    ],
  });

  const createResponse = await request("/otd/", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      customer_id: "customer-002",
      amount: "15.00",
      type: "fixed",
    }),
  });
  assert.equal(createResponse.status, 201);
  const created = await createResponse.json();
  assert.deepEqual(created, {
    id: "discount-002",
    customer_id: "customer-002",
    amount: "15.00",
    type: "fixed",
  });

  const persisted = await request("/otd/");
  assert.equal(persisted.status, 200);
  assert.equal((await persisted.json()).results.length, 2);
});

test("lists entitlements and filters by customer", async () => {
  const allResponse = await request("/entitlements/");
  assert.equal(allResponse.status, 200);
  assert.equal((await allResponse.json()).results.length, 3);

  const filteredResponse = await request(
    "/entitlements/?customer=customer-001",
  );
  assert.equal(filteredResponse.status, 200);
  assert.deepEqual(await filteredResponse.json(), {
    results: [
      {
        id: "entitlement-001",
        customer_id: "customer-001",
        status: "active",
      },
      {
        id: "entitlement-003",
        customer_id: "customer-001",
        status: "expired",
      },
    ],
  });

  const emptyResponse = await request("/entitlements/?customer=unknown");
  assert.equal(emptyResponse.status, 200);
  assert.deepEqual(await emptyResponse.json(), { results: [] });
});
