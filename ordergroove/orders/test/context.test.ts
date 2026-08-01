import assert from "node:assert/strict";
import test from "node:test";
import { Store } from "../../_.store.ts";
import { Context } from "../routes/_.context.ts";
import type { Context$ } from "../types/_.context.ts";

const createContext = () => new Context({ store: new Store() } as Context$);

const seed = (context: Context) => {
  context.seedOrders([
    {
      id: "order-internal-001",
      public_id: "order-001",
      customer_id: "customer-001",
      place: "2026-03-15T12:00:00Z",
      status: 1,
      total: "27.00",
    },
    {
      id: "order-internal-002",
      public_id: "order-002",
      customer_id: "customer-002",
      place: "2026-02-20T12:00:00Z",
      status: 5,
      total: "42.00",
    },
  ]);
  context.store.seedSubscriptions([
    {
      subscription: {
        public_id: "subscription-001",
        customer_id: "customer-001",
        every: 1,
        every_period: "month",
        live: true,
      },
      createdAt: "2026-01-15",
    },
  ]);
  context.store.seedItems([
    {
      public_id: "item-001",
      order_id: "order-001",
      subscription_id: "subscription-001",
      product_id: "product-001",
      quantity: 1,
    },
  ]);
};

test("authorizes only the configured API key", () => {
  const context = createContext();

  assert.equal(context.isAuthorized(context.apiKey), true);
  assert.equal(context.isAuthorized("wrong"), false);
  assert.equal(context.isAuthorized(undefined), false);
});

test("seeds, lists, and retrieves orders without exposing mutable state", () => {
  const context = createContext();
  seed(context);

  const listed = context.listOrders({});
  assert.equal(listed.length, 2);
  assert.equal(context.getOrder("order-001")?.total, "27.00");

  listed[0]!.total = "0.00";
  assert.equal(context.getOrder("order-001")?.total, "27.00");
});

test("filters orders by customer and status", () => {
  const context = createContext();
  seed(context);

  assert.deepEqual(
    context
      .listOrders({ customer: "customer-001" })
      .map(({ public_id }) => public_id),
    ["order-001"],
  );
  assert.deepEqual(
    context.listOrders({ status: 5 }).map(({ public_id }) => public_id),
    ["order-002"],
  );
  assert.deepEqual(
    context.listOrders({ customer: "customer-001", status: 5 }),
    [],
  );
});

test("cancels an order persistently", () => {
  const context = createContext();
  seed(context);

  assert.equal(context.cancelOrder("order-001")?.status, 4);
  assert.equal(context.getOrder("order-001")?.status, 4);
  const nextOrder = context.getOrder("order-003");
  assert.equal(nextOrder?.status, 1);
  assert.equal(nextOrder?.place, "2026-04-15T12:00:00.000Z");
  assert.deepEqual(
    context.store.listItems({ order: "order-003" }).map((item) => ({
      order_id: item.order_id,
      subscription_id: item.subscription_id,
    })),
    [{ order_id: "order-003", subscription_id: "subscription-001" }],
  );
  assert.equal(context.cancelOrder("missing"), undefined);
});

test("sends an order now by persisting its immediate place and SEND_NOW status", () => {
  const context = createContext();
  seed(context);

  const sent = context.sendOrderNow("order-001", "2026-03-01T10:30:00.000Z");

  assert.equal(sent?.place, "2026-03-01T10:30:00.000Z");
  assert.equal(sent?.status, 6);
  assert.deepEqual(context.getOrder("order-001"), sent);
  assert.equal(
    context.getOrder("order-003")?.place,
    "2026-04-01T10:30:00.000Z",
  );
  assert.equal(context.sendOrderNow("missing"), undefined);
});
