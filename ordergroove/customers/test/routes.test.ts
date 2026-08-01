import assert from "node:assert/strict";
import net from "node:net";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { counterfact } from "counterfact";
import type { Context } from "../routes/_.context.ts";

const basePath = fileURLToPath(new URL("../../", import.meta.url));
const openApiPath = fileURLToPath(
  new URL("../../openapi/customers.yml", import.meta.url),
);
const apiKey = "ordergroove-local-api-key";

let port: number;
let server: { stop(): Promise<void> } | undefined;
let context: Context;

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
      const response = await request("/customers/customers");
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
    prefix: "/customers",
    proxyPaths: new Map([["", false]]),
    proxyUrl: "",
    startAdminApi: false,
    startRepl: false,
    startServer: true,
    validateRequests: true,
    validateResponses: true,
    watch: { routes: false, types: false },
  };

  const app = await counterfact(config, [
    { source: openApiPath, group: "customers", prefix: "/customers" },
  ]);
  server = await app.start(config);
  context = app.contextRegistry.find("/") as Context;
  await waitForServer();
});

test.after(async () => {
  await server?.stop();
});

test("requires a valid API key", async () => {
  const missing = await fetch(`http://127.0.0.1:${port}/customers/customers`);
  assert.equal(missing.status, 401);
  assert.deepEqual(await missing.json(), { error: "Unauthorized" });

  const invalid = await request("/customers/customers", {
    headers: { "x-api-key": "invalid" },
  });
  assert.equal(invalid.status, 401);
});

test("lists deterministic startup customers", async () => {
  const response = await request("/customers/customers");
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), {
    results: [
      {
        id: "customer-internal-001",
        public_id: "customer-001",
        merchant_id: "merchant-001",
        merchant_user_id: "user-001",
        first_name: "Ada",
        last_name: "Lovelace",
        email: "ada@example.com",
      },
      {
        id: "customer-internal-002",
        public_id: "customer-002",
        merchant_id: "merchant-001",
        merchant_user_id: "user-002",
        first_name: "Grace",
        last_name: "Hopper",
        email: "grace@example.com",
      },
    ],
    next: null,
    previous: null,
  });
});

test("creates and retrieves a persisted customer", async () => {
  const createResponse = await request("/customers/customers", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      merchant_id: "merchant-001",
      merchant_user_id: "user-003",
      first_name: "Katherine",
      last_name: "Johnson",
      email: "katherine@example.com",
    }),
  });
  assert.equal(createResponse.status, 201);
  const created = await createResponse.json();
  assert.equal(created.id, "customer-internal-003");
  assert.equal(created.public_id, "customer-003");
  assert.equal(
    context.getCustomer("customer-003")?.email,
    "katherine@example.com",
  );

  const retrieveResponse = await request("/customers/customers/customer-003");
  assert.equal(retrieveResponse.status, 200);
  assert.deepEqual(await retrieveResponse.json(), created);
});

test("replaces a customer and returns 404 for unknown customers", async () => {
  const updateResponse = await request("/customers/customers/customer-003", {
    method: "PUT",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      first_name: "Katherine",
      last_name: "Gobble",
      email: "kg@example.com",
    }),
  });
  assert.equal(updateResponse.status, 200);
  assert.deepEqual(await updateResponse.json(), {
    id: "customer-internal-003",
    public_id: "customer-003",
    first_name: "Katherine",
    last_name: "Gobble",
    email: "kg@example.com",
  });
  assert.equal(context.getCustomer("customer-003")?.merchant_id, undefined);

  const missingGet = await request("/customers/customers/not-found");
  assert.equal(missingGet.status, 404);
  assert.deepEqual(await missingGet.json(), { error: "Customer not found" });

  const missingPut = await request("/customers/customers/not-found", {
    method: "PUT",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ first_name: "Nobody" }),
  });
  assert.equal(missingPut.status, 404);
});
