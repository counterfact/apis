import assert from "node:assert/strict";
import test from "node:test";
import { Store } from "../../_.store.ts";
import { Context } from "../routes/_.context.ts";
import type { Context$ } from "../types/_.context.ts";

const createContext = () => new Context({ store: new Store() } as Context$);

const seed = (context: Context) => {
  context.seedSubscriptions([
    {
      subscription: {
        id: "subscription-internal-001",
        public_id: "subscription-001",
        customer_id: "customer-001",
        product_id: "product-001",
        quantity: 1,
        every: 1,
        every_period: "month",
        live: true,
      },
      createdAt: "2026-01-15",
    },
    {
      subscription: {
        id: "subscription-internal-002",
        public_id: "subscription-002",
        customer_id: "customer-002",
        product_id: "product-002",
        quantity: 2,
        every: 2,
        every_period: "week",
        live: false,
      },
      createdAt: "2026-02-20",
    },
  ]);
};

test("authorizes only the configured API key", () => {
  const context = createContext();

  assert.equal(context.isAuthorized(context.apiKey), true);
  assert.equal(context.isAuthorized("wrong"), false);
  assert.equal(context.isAuthorized(undefined), false);
});

test("seeds, lists, and retrieves subscriptions without exposing mutable state", () => {
  const context = createContext();
  seed(context);

  const listed = context.listSubscriptions({});
  assert.equal(listed.length, 2);
  assert.equal(context.getSubscription("subscription-001")?.quantity, 1);

  listed[0]!.quantity = 99;
  assert.equal(context.getSubscription("subscription-001")?.quantity, 1);
});

test("filters subscriptions by customer, product, live status, and inclusive creation dates", () => {
  const context = createContext();
  seed(context);

  assert.deepEqual(
    context
      .listSubscriptions({ customer: "customer-001" })
      .map(({ public_id }) => public_id),
    ["subscription-001"],
  );
  assert.deepEqual(
    context
      .listSubscriptions({ product: "product-002", live: false })
      .map(({ public_id }) => public_id),
    ["subscription-002"],
  );
  assert.deepEqual(
    context
      .listSubscriptions({
        created_start: "2026-01-15",
        created_end: "2026-01-15",
      })
      .map(({ public_id }) => public_id),
    ["subscription-001"],
  );
  assert.deepEqual(
    context
      .listSubscriptions({
        created_start: "2026-01-16",
        created_end: "2026-02-19",
      })
      .map(({ public_id }) => public_id),
    [],
  );
});

test("replacement preserves identifiers, removes omitted fields, and persists", () => {
  const context = createContext();
  seed(context);

  const replaced = context.replaceSubscription("subscription-001", {
    id: "ignored-id",
    public_id: "ignored-public-id",
    customer_id: "customer-002",
    product_id: "product-002",
    quantity: 4,
    every: 3,
    every_period: "month",
    live: true,
  });

  assert.deepEqual(replaced, {
    id: "subscription-internal-001",
    public_id: "subscription-001",
    customer_id: "customer-002",
    product_id: "product-002",
    quantity: 4,
    every: 3,
    every_period: "month",
    live: true,
  });
  assert.deepEqual(context.getSubscription("subscription-001"), replaced);
  assert.equal(context.replaceSubscription("missing", {}), undefined);
});

test("cancels, reactivates, and changes subscription frequency persistently", () => {
  const context = createContext();
  seed(context);

  context.store.seedOrders([
    {
      public_id: "future-order",
      customer_id: "customer-001",
      status: 1,
    },
    {
      public_id: "placed-order",
      customer_id: "customer-001",
      status: 5,
    },
  ]);
  context.store.seedItems([
    {
      public_id: "future-item",
      order_id: "future-order",
      subscription_id: "subscription-001",
    },
    {
      public_id: "placed-item",
      order_id: "placed-order",
      subscription_id: "subscription-001",
    },
  ]);

  assert.equal(context.cancelSubscription("subscription-001")?.live, false);
  assert.equal(context.getSubscription("subscription-001")?.live, false);
  assert.equal(context.store.getOrder("future-order"), undefined);
  assert.deepEqual(context.store.listItems({ order: "future-order" }), []);
  assert.equal(context.store.getOrder("placed-order")?.status, 5);
  assert.equal(
    context.store.listItems({ order: "placed-order" })[0]?.public_id,
    "placed-item",
  );
  assert.equal(context.reactivateSubscription("subscription-001")?.live, true);

  const changed = context.changeSubscriptionFrequency("subscription-001", {
    every: 6,
    every_period: "week",
  });
  assert.equal(changed?.every, 6);
  assert.equal(changed?.every_period, "week");
  assert.equal(context.getSubscription("subscription-001")?.every, 6);

  assert.equal(context.cancelSubscription("missing"), undefined);
  assert.equal(context.reactivateSubscription("missing"), undefined);
  assert.equal(
    context.changeSubscriptionFrequency("missing", { every: 1 }),
    undefined,
  );
});
