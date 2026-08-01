import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import net from "node:net";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { counterfact } from "counterfact";

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
  source: fileURLToPath(
    new URL(`../openapi/${group}.yml`, import.meta.url),
  ),
  group,
  prefix: "",
}));
const apiKey = "ordergroove-local-api-key";

type Resource = Record<string, unknown>;

let port: number;
let server: { stop(): Promise<void> } | undefined;

const request = (pathname: string, init: RequestInit = {}) =>
  fetch(`http://127.0.0.1:${port}${pathname}`, {
    ...init,
    headers: { "x-api-key": apiKey, ...init.headers },
  });

const results = async (pathname: string): Promise<Resource[]> => {
  const response = await request(pathname);
  assert.equal(response.status, 200, pathname);
  return ((await response.json()) as { results: Resource[] }).results;
};

const ids = (resources: Resource[], key = "id") =>
  new Set(resources.map((resource) => resource[key]));

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
  const openApiPath = specifications[0].source;
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

test("runs the combined simulator on the pinned Counterfact version", async () => {
  const packageManifest = JSON.parse(
    await readFile(new URL("../package.json", import.meta.url), "utf8"),
  ) as { dependencies: { counterfact: string } };
  const installedManifest = JSON.parse(
    await readFile(
      new URL("../node_modules/counterfact/package.json", import.meta.url),
      "utf8",
    ),
  ) as { version: string };

  assert.equal(packageManifest.dependencies.counterfact, "^2.15.0");
  assert.equal(installedManifest.version, "2.15.0");
});

test("starts all six APIs with their seeded scenarios at canonical paths", async () => {
  const canonicalCollections = [
    "/customers/",
    "/items/",
    "/offer_profiles/",
    "/otd/",
    "/entitlements/",
    "/orders/",
    "/products/",
    "/subscriptions/",
  ];

  for (const pathname of canonicalCollections) {
    const response = await request(pathname);
    assert.equal(response.status, 200, pathname);
    assert.ok(
      ((await response.json()) as { results: Resource[] }).results.length > 0,
      `${pathname} should contain deterministic startup data`,
    );
  }

  for (const pathname of [
    "/customers/customers/",
    "/items/items/",
    "/offers/offer_profiles/",
    "/orders/orders/",
    "/products/products/",
    "/subscriptions/subscriptions/",
  ]) {
    const response = await request(pathname);
    assert.equal(response.status, 404, pathname);
  }
});

test("requires an API key for every API group", async () => {
  for (const pathname of [
    "/customers/",
    "/items/",
    "/offer_profiles/",
    "/orders/",
    "/products/",
    "/subscriptions/",
  ]) {
    const response = await fetch(`http://127.0.0.1:${port}${pathname}`);
    assert.equal(response.status, 401, pathname);
    assert.deepEqual(await response.json(), { error: "Unauthorized" });
  }
});

test("keeps seeded customer commerce chains coherent across APIs", async () => {
  const [
    customers,
    products,
    offers,
    entitlements,
    subscriptions,
    orders,
    items,
  ] = await Promise.all([
    results("/customers/"),
    results("/products/"),
    results("/offer_profiles/"),
    results("/entitlements/"),
    results("/subscriptions/"),
    results("/orders/"),
    results("/items/"),
  ]);

  const customerIds = ids(customers, "public_id");
  const productIds = ids(products);
  const offerIds = ids(offers);
  const subscriptionIds = ids(subscriptions, "public_id");
  const orderIds = ids(orders, "public_id");

  for (const entitlement of entitlements) {
    assert.ok(customerIds.has(entitlement.customer_id));
  }
  for (const subscription of subscriptions) {
    assert.ok(customerIds.has(subscription.customer_id));
    assert.ok(productIds.has(subscription.product_id));
    assert.ok(offerIds.has(subscription.offer_id));
  }
  for (const order of orders) {
    assert.ok(customerIds.has(order.customer_id));
  }
  for (const item of items) {
    assert.ok(orderIds.has(item.order_id));
    assert.ok(subscriptionIds.has(item.subscription_id));
    assert.ok(productIds.has(item.product_id));
    assert.ok(offerIds.has(item.offer_id));
  }

  const customerOneEntitlements = await results(
    "/entitlements/?customer=customer-001",
  );
  const customerOneSubscriptions = await results(
    "/subscriptions/?customer=customer-001",
  );
  const customerOneOrders = await results("/orders/?customer=customer-001");
  const subscriptionOneItems = await results(
    "/items/?subscription=subscription-001",
  );

  assert.ok(
    customerOneEntitlements.every(
      (entitlement) => entitlement.customer_id === "customer-001",
    ),
  );
  assert.deepEqual(
    customerOneSubscriptions.map((subscription) => subscription.public_id),
    ["subscription-001"],
  );
  assert.deepEqual(
    customerOneOrders.map((order) => order.public_id),
    ["order-001"],
  );
  assert.deepEqual(
    subscriptionOneItems.map((item) => item.public_id),
    ["item-001"],
  );
});

test("persists representative cross-resource changes on the combined server", async () => {
  const discountResponse = await request("/otd/", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      customer_id: "customer-001",
      amount: "3.00",
      type: "fixed",
    }),
  });
  assert.equal(discountResponse.status, 201);
  const discount = (await discountResponse.json()) as Resource;
  assert.equal(discount.customer_id, "customer-001");

  const cancelResponse = await request(
    "/subscriptions/subscription-001/cancel/",
    { method: "POST" },
  );
  assert.equal(cancelResponse.status, 200);
  assert.equal(((await cancelResponse.json()) as Resource).live, false);

  const sendNowResponse = await request("/orders/order-001/send_now/", {
    method: "POST",
  });
  assert.equal(sendNowResponse.status, 200);
  assert.equal(((await sendNowResponse.json()) as Resource).status, "pending");

  const createItemResponse = await request("/items/", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      order_id: "order-001",
      subscription_id: "subscription-001",
      product_id: "product-001",
      quantity: 1,
      price: "19.99",
      total_price: "19.99",
      offer_id: "offer-profile-001",
      one_time: true,
    }),
  });
  assert.equal(createItemResponse.status, 201);
  const createdItem = (await createItemResponse.json()) as Resource;

  const [discounts, persistedSubscription, persistedOrder, persistedItem] =
    await Promise.all([
      results("/otd/"),
      request("/subscriptions/subscription-001/"),
      request("/orders/order-001/"),
      request(`/items/${createdItem.public_id as string}/`),
    ]);
  assert.ok(discounts.some(({ id }) => id === discount.id));
  assert.equal(persistedSubscription.status, 200);
  assert.equal(((await persistedSubscription.json()) as Resource).live, false);
  assert.equal(persistedOrder.status, 200);
  assert.equal(((await persistedOrder.json()) as Resource).status, "pending");
  assert.equal(persistedItem.status, 200);
  assert.equal(
    ((await persistedItem.json()) as Resource).subscription_id,
    "subscription-001",
  );
});
