import assert from "node:assert/strict";
import net from "node:net";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { counterfact } from "counterfact";

const basePath = fileURLToPath(new URL("../../", import.meta.url));
const openApiPath = fileURLToPath(
  new URL("../../openapi/products.yml", import.meta.url),
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
      const response = await request("/products/");
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
  const missing = await fetch(`http://127.0.0.1:${port}/products/`);
  assert.equal(missing.status, 401);
  assert.deepEqual(await missing.json(), { error: "Unauthorized" });

  const invalid = await request("/products/", {
    headers: { "x-api-key": "invalid" },
  });
  assert.equal(invalid.status, 401);
});

test("lists deterministic startup products", async () => {
  const response = await request("/products/");
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), {
    results: [
      {
        id: "product-001",
        price: "19.99",
        external_product_id: "sku-coffee",
        autoship_enabled: true,
      },
      {
        id: "product-002",
        price: "12.50",
        external_product_id: "sku-filters",
        autoship_enabled: false,
      },
    ],
    next: null,
    previous: null,
  });
});

test("retrieves, replaces, and persists a product", async () => {
  const retrieveResponse = await request("/products/product-001/");
  assert.equal(retrieveResponse.status, 200);
  assert.equal(
    (await retrieveResponse.json()).external_product_id,
    "sku-coffee",
  );

  const updateResponse = await request("/products/product-001/", {
    method: "PUT",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      id: "ignored-id",
      price: "21.50",
      autoship_enabled: false,
    }),
  });
  assert.equal(updateResponse.status, 200);
  assert.deepEqual(await updateResponse.json(), {
    id: "product-001",
    price: "21.50",
    autoship_enabled: false,
  });

  const persistedResponse = await request("/products/product-001/");
  assert.equal(persistedResponse.status, 200);
  assert.deepEqual(await persistedResponse.json(), {
    id: "product-001",
    price: "21.50",
    autoship_enabled: false,
  });
});

test("returns 404 for unknown products", async () => {
  const missingGet = await request("/products/not-found/");
  assert.equal(missingGet.status, 404);
  assert.deepEqual(await missingGet.json(), { error: "Product not found" });

  const missingPut = await request("/products/not-found/", {
    method: "PUT",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ price: "1.00" }),
  });
  assert.equal(missingPut.status, 404);
  assert.deepEqual(await missingPut.json(), { error: "Product not found" });
});
