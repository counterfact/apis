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
      status: "unsent",
      total: "27.00",
    },
    {
      id: "order-internal-002",
      public_id: "order-002",
      customer_id: "customer-002",
      place: "2026-02-20T12:00:00Z",
      status: "success",
      total: "42.00",
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
    context.listOrders({ status: "success" }).map(({ public_id }) => public_id),
    ["order-002"],
  );
  assert.deepEqual(
    context.listOrders({ customer: "customer-001", status: "success" }),
    [],
  );
});

test("cancels an order persistently", () => {
  const context = createContext();
  seed(context);

  assert.equal(context.cancelOrder("order-001")?.status, "cancelled");
  assert.equal(context.getOrder("order-001")?.status, "cancelled");
  assert.equal(context.cancelOrder("missing"), undefined);
});

test("sends an order now by persisting its immediate place and pending status", () => {
  const context = createContext();
  seed(context);

  const sent = context.sendOrderNow("order-001", "2026-03-01T10:30:00.000Z");

  assert.equal(sent?.place, "2026-03-01T10:30:00.000Z");
  assert.equal(sent?.status, "pending");
  assert.deepEqual(context.getOrder("order-001"), sent);
  assert.equal(context.sendOrderNow("missing"), undefined);
});
