import assert from "node:assert/strict";
import test from "node:test";
import { Context } from "../routes/_.context.ts";

const createContext = () => new Context({} as never);

const seed = (context: Context) => {
  context.seedItems([
    {
      id: "item-internal-001",
      public_id: "item-001",
      order_id: "order-001",
      subscription_id: "subscription-001",
      product_id: "product-001",
      quantity: 1,
      price: "19.99",
      total_price: "19.99",
      offer_id: "offer-profile-001",
      one_time: false,
    },
    {
      id: "item-internal-002",
      public_id: "item-002",
      order_id: "order-002",
      subscription_id: "subscription-002",
      product_id: "product-002",
      quantity: 2,
      price: "12.50",
      total_price: "25.00",
      offer_id: "offer-profile-002",
      one_time: false,
    },
  ]);
};

test("authorizes only the configured API key", () => {
  const context = createContext();

  assert.equal(context.isAuthorized(context.apiKey), true);
  assert.equal(context.isAuthorized("wrong"), false);
  assert.equal(context.isAuthorized(undefined), false);
});

test("seeds, lists, and retrieves items without exposing mutable state", () => {
  const context = createContext();
  seed(context);

  const listed = context.listItems({});
  assert.equal(listed.length, 2);
  assert.equal(context.getItem("item-001")?.product_id, "product-001");

  listed[0]!.quantity = 99;
  assert.equal(context.getItem("item-001")?.quantity, 1);
});

test("filters items by subscription and order", () => {
  const context = createContext();
  seed(context);

  assert.deepEqual(
    context
      .listItems({ subscription: "subscription-001" })
      .map(({ public_id }) => public_id),
    ["item-001"],
  );
  assert.deepEqual(
    context.listItems({ order: "order-002" }).map(({ public_id }) => public_id),
    ["item-002"],
  );
  assert.deepEqual(
    context.listItems({
      subscription: "subscription-001",
      order: "order-002",
    }),
    [],
  );
});

test("creates items with deterministic identifiers and persists them", () => {
  const context = createContext();
  seed(context);

  const created = context.createItem({
    order_id: "order-001",
    subscription_id: "subscription-001",
    product_id: "product-002",
    quantity: 3,
    price: "12.50",
    total_price: "37.50",
    one_time: true,
  });

  assert.equal(created.id, "item-internal-003");
  assert.equal(created.public_id, "item-003");
  assert.deepEqual(context.getItem("item-003"), created);
});

test("deletes items persistently and reports whether an item existed", () => {
  const context = createContext();
  seed(context);

  assert.equal(context.deleteItem("item-001"), true);
  assert.equal(context.getItem("item-001"), undefined);
  assert.equal(context.deleteItem("item-001"), false);
});
