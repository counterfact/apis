import assert from "node:assert/strict";
import { createServer } from "node:net";
import path from "node:path";
import test from "node:test";
import { counterfact } from "counterfact";

const root = path.resolve(import.meta.dirname, "..");
const key = "ordergroove-simulator-key";

const unusedPort = async () => {
  const server = createServer();
  await new Promise<void>((resolve) => server.listen(0, "127.0.0.1", resolve));
  const address = server.address();
  if (!address || typeof address === "string") throw new Error("No test port");
  await new Promise<void>((resolve, reject) =>
    server.close((error) => (error ? reject(error) : resolve())),
  );
  return address.port;
};

const startSimulator = async () => {
  const port = await unusedPort();
  const { start } = await counterfact({
    openApiPath: path.join(root, "openapi.yaml"),
    basePath: root,
    port,
    startServer: true,
    startRepl: false,
    generate: { routes: false, types: false },
    watch: { routes: false, types: false },
    alwaysFakeOptionals: false,
    buildCache: false,
    proxyPaths: new Map(),
    proxyUrl: "",
    prefix: "",
    validateRequests: true,
    validateResponses: true,
    noUpdateCheck: true,
  });
  const running = await start({
    startServer: true,
    generate: { routes: false, types: false },
    watch: { routes: false, types: false },
    buildCache: false,
  });

  return {
    close: running.stop,
    request: (pathname: string, init: RequestInit = {}) =>
      fetch(`http://127.0.0.1:${port}${pathname}`, {
        ...init,
        headers: { "x-api-key": key, ...init.headers },
      }),
  };
};

test("real HTTP workflow persists changes and rejects unsafe repeats", async () => {
  const simulator = await startSimulator();
  try {
    const unauthenticated = await fetch(
      (await simulator.request("/customers/customer_demo/", { headers: {} }))
        .url,
    );
    assert.equal(unauthenticated.status, 403);

    const customer = await simulator.request("/customers/customer_demo/");
    assert.equal(customer.status, 200);
    assert.match(
      customer.headers.get("content-type") ?? "",
      /application\/json/,
    );
    assert.equal((await customer.json()).merchant_user_id, "customer_demo");

    const subscriptions = await simulator.request(
      "/subscriptions/?customer=customer_demo&page_size=1",
    );
    assert.equal(subscriptions.status, 200);
    const subscriptionPage = await subscriptions.json();
    assert.equal(subscriptionPage.results.length, 1);
    assert.equal(subscriptionPage.results[0].public_id, "subscription_coffee");
    assert.equal(typeof subscriptionPage.next, "string");

    const product = await simulator.request("/products/coffee_demo/");
    assert.equal(product.status, 200);

    const order = await simulator.request("/orders/order_upcoming/");
    assert.equal(order.status, 200);

    const originalItems = await simulator.request(
      "/items/?order=order_upcoming",
    );
    assert.equal((await originalItems.json()).results.length, 2);

    const changed = await simulator.request(
      "/subscriptions/subscription_coffee/change_quantity/",
      {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ quantity: 3 }),
      },
    );
    assert.equal(changed.status, 200);
    assert.equal((await changed.json()).quantity, 3);

    const updatedItem = await simulator.request("/items/item_coffee/");
    assert.equal((await updatedItem.json()).quantity, 3);

    const skipped = await simulator.request(
      "/orders/order_upcoming/skip_subscription/",
      {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ subscription: "subscription_coffee" }),
      },
    );
    assert.equal(skipped.status, 200);

    const moved = await simulator.request(
      "/items/?subscription=subscription_coffee",
    );
    assert.equal((await moved.json()).results[0].order, "order_generated_1");

    const beforeRepeat = await (
      await simulator.request("/orders/?customer=customer_demo")
    ).json();
    const repeated = await simulator.request(
      "/orders/order_upcoming/skip_subscription/",
      {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ subscription: "subscription_coffee" }),
      },
    );
    assert.equal(repeated.status, 400);
    assert.deepEqual(
      await (await simulator.request("/orders/?customer=customer_demo")).json(),
      beforeRepeat,
    );

    const invalid = await simulator.request(
      "/orders/order_upcoming/skip_subscription/",
      {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ subscription: "subscription_other_customer" }),
      },
    );
    assert.equal(invalid.status, 400);
  } finally {
    await simulator.close();
  }
});

test("request validation rejects malformed actions before mutation", async () => {
  const simulator = await startSimulator();
  try {
    const invalid = await simulator.request(
      "/subscriptions/subscription_coffee/change_quantity/",
      {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ quantity: 0 }),
      },
    );
    assert.equal(invalid.status, 400);
    const unchanged = await simulator.request(
      "/subscriptions/subscription_coffee/",
    );
    assert.equal((await unchanged.json()).quantity, 2);
  } finally {
    await simulator.close();
  }
});

test("customer creation persists and duplicate identifiers are rejected", async () => {
  const simulator = await startSimulator();
  const input = {
    merchant: "merchant_demo",
    merchant_user_id: "customer_created",
    session_id: "merchant_demo.session_created",
    user_token_id: "",
    first_name: "Lin",
    last_name: "Example",
    email: "lin@example.invalid",
    phone_number: "+15555550102",
    phone_type: "mobile",
    live: true,
    created: "2026-08-02 12:00:00",
    last_updated: "2026-08-02 12:00:00",
    last_login: null,
    locale: "en-US",
  };
  try {
    const create = () =>
      simulator.request("/customers/create/", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(input),
      });
    assert.equal((await create()).status, 200);
    const retrieved = await simulator.request("/customers/customer_created/");
    assert.equal(retrieved.status, 200);
    assert.equal((await retrieved.json()).email, "lin@example.invalid");
    assert.equal((await create()).status, 400);

    const unknown = await simulator.request("/items/not_a_real_item/");
    assert.equal(unknown.status, 404);
  } finally {
    await simulator.close();
  }
});

test("a fresh Counterfact instance deterministically resets state", async () => {
  const simulator = await startSimulator();
  try {
    const subscription = await simulator.request(
      "/subscriptions/subscription_coffee/",
    );
    assert.equal((await subscription.json()).quantity, 2);
    const order = await simulator.request("/orders/order_upcoming/");
    assert.equal((await order.json()).status, 1);
  } finally {
    await simulator.close();
  }
});
