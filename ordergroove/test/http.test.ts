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

test("address and payment lists support filters, pagination, and retrieves", async () => {
  const simulator = await startSimulator();
  try {
    const addresses = await simulator.request(
      "/addresses/?customer=customer_demo&live=true&page_size=1",
    );
    assert.equal(addresses.status, 200);
    const addressPage = await addresses.json();
    assert.equal(addressPage.results.length, 1);
    assert.equal(addressPage.results[0].public_id, "address_demo");
    assert.equal(typeof addressPage.next, "string");

    const addressCursor = new URL(addressPage.next).searchParams.get("cursor");
    assert.ok(addressCursor);
    const nextAddresses = await simulator.request(
      `/addresses/?customer=customer_demo&live=true&page_size=1&cursor=${encodeURIComponent(addressCursor)}`,
    );
    assert.equal(nextAddresses.status, 200);
    assert.equal(
      (await nextAddresses.json()).results[0].public_id,
      "address_alternate",
    );

    const address = await simulator.request("/addresses/address_demo/");
    assert.equal(address.status, 200);
    assert.equal((await address.json()).customer, "customer_demo");

    const payments = await simulator.request(
      "/payments/?customer=customer_demo&page_size=1",
    );
    assert.equal(payments.status, 200);
    const paymentPage = await payments.json();
    assert.equal(paymentPage.results.length, 1);
    assert.equal(paymentPage.results[0].public_id, "payment_demo");
    assert.equal(typeof paymentPage.next, "string");

    const payment = await simulator.request("/payments/payment_demo/");
    assert.equal(payment.status, 200);
    assert.equal((await payment.json()).billing_address, "address_demo");

    assert.equal(
      (await simulator.request("/addresses/address_missing/")).status,
      404,
    );
    assert.equal(
      (await simulator.request("/payments/payment_missing/")).status,
      404,
    );
  } finally {
    await simulator.close();
  }
});

test("shipping and payment actions persist through real HTTP", async () => {
  const simulator = await startSimulator();
  const patchAssociation = (pathname: string, body: object) =>
    simulator.request(pathname, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body),
    });

  try {
    const subscriptionShipping = await patchAssociation(
      "/subscriptions/subscription_coffee/change_shipping/",
      { shipping_address: "address_alternate" },
    );
    assert.equal(subscriptionShipping.status, 200);
    assert.equal(
      (await subscriptionShipping.json()).shipping_address,
      "address_alternate",
    );

    const subscriptionPayment = await patchAssociation(
      "/subscriptions/subscription_coffee/change_payment/",
      { payment: "payment_alternate" },
    );
    assert.equal(subscriptionPayment.status, 200);
    assert.equal(
      (await subscriptionPayment.json()).payment,
      "payment_alternate",
    );

    const orderShipping = await patchAssociation(
      "/orders/order_upcoming/change_shipping/",
      { shipping_address: "address_alternate" },
    );
    assert.equal(orderShipping.status, 200);
    assert.equal(
      (await orderShipping.json()).shipping_address,
      "address_alternate",
    );

    const orderPayment = await patchAssociation(
      "/orders/order_upcoming/change_payment/",
      { payment: "payment_alternate" },
    );
    assert.equal(orderPayment.status, 200);
    assert.equal((await orderPayment.json()).payment, "payment_alternate");

    const subscription = await (
      await simulator.request("/subscriptions/subscription_coffee/")
    ).json();
    assert.equal(subscription.shipping_address, "address_alternate");
    assert.equal(subscription.payment, "payment_alternate");

    const order = await (
      await simulator.request("/orders/order_upcoming/")
    ).json();
    assert.equal(order.shipping_address, "address_alternate");
    assert.equal(order.payment, "payment_alternate");
  } finally {
    await simulator.close();
  }
});

test("association actions reject malformed and unsafe changes atomically", async () => {
  const simulator = await startSimulator();
  const patchAssociation = (pathname: string, body: object) =>
    simulator.request(pathname, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body),
    });

  try {
    const subscriptionBefore = await (
      await simulator.request("/subscriptions/subscription_coffee/")
    ).json();
    const orderBefore = await (
      await simulator.request("/orders/order_upcoming/")
    ).json();

    assert.equal(
      (
        await patchAssociation(
          "/subscriptions/subscription_coffee/change_shipping/",
          {},
        )
      ).status,
      400,
    );
    assert.equal(
      (
        await patchAssociation("/orders/order_upcoming/change_payment/", {
          payment: "payment_other_customer",
        })
      ).status,
      400,
    );
    assert.equal(
      (
        await patchAssociation(
          "/subscriptions/subscription_coffee/change_shipping/",
          { shipping_address: "address_missing" },
        )
      ).status,
      400,
    );
    assert.equal(
      (
        await patchAssociation(
          "/subscriptions/subscription_missing/change_payment/",
          { payment: "payment_demo" },
        )
      ).status,
      404,
    );
    assert.equal(
      (
        await patchAssociation("/orders/order_missing/change_shipping/", {
          shipping_address: "address_demo",
        })
      ).status,
      404,
    );

    assert.deepEqual(
      await (
        await simulator.request("/subscriptions/subscription_coffee/")
      ).json(),
      subscriptionBefore,
    );
    assert.deepEqual(
      await (await simulator.request("/orders/order_upcoming/")).json(),
      orderBefore,
    );
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
    const orderBody = await order.json();
    assert.equal(orderBody.status, 1);
    assert.equal(orderBody.shipping_address, "address_demo");
    assert.equal(orderBody.payment, "payment_demo");

    const address = await simulator.request("/addresses/address_demo/");
    assert.equal((await address.json()).live, true);
    const payment = await simulator.request("/payments/payment_demo/");
    assert.equal((await payment.json()).live, true);
  } finally {
    await simulator.close();
  }
});
