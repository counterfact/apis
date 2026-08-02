import assert from "node:assert/strict";
import test from "node:test";
import { addRecurrence } from "../domain/recurrence.ts";
import { CommerceStore, DomainError, createSeedData } from "../domain/store.ts";

test("calendar recurrence clamps month-end and leap-year dates", () => {
  assert.equal(addRecurrence("2024-01-31", 1, 3), "2024-02-29");
  assert.equal(addRecurrence("2023-01-31", 1, 3), "2023-02-28");
  assert.equal(addRecurrence("2024-02-29", 1, 4), "2025-02-28");
  assert.equal(addRecurrence("2026-08-02", 2, 2), "2026-08-16");
});

test("reads are clone-safe and preserve distinct identifiers", () => {
  const store = new CommerceStore(createSeedData());
  const customer = store.getCustomer("customer_demo");
  assert.ok(customer);
  customer.first_name = "mutated outside";

  assert.equal(store.getCustomer("customer_demo")?.first_name, "Ada");
  assert.equal(
    store.getSubscription("subscription_coffee")?.customer,
    "customer_demo",
  );
  assert.equal(
    store.getSubscription("subscription_coffee")?.product,
    "coffee_demo",
  );
});

test("change quantity is atomic, updates unsent items, and rejects invalid state", () => {
  const store = new CommerceStore(createSeedData());
  const updated = store.changeSubscriptionQuantity("subscription_coffee", 3);

  assert.equal(updated.quantity, 3);
  assert.equal(store.getItem("item_coffee")?.quantity, 3);

  const before = store.snapshot();
  assert.throws(
    () => store.changeSubscriptionQuantity("subscription_coffee", 0),
    (error: unknown) => error instanceof DomainError && error.status === 400,
  );
  assert.deepEqual(store.snapshot(), before);
});

test("prepaid quantity changes and non-unsent skips are invalid transitions", () => {
  const prepaidSeed = createSeedData();
  const prepaid = prepaidSeed.subscriptions.find(
    (subscription) => subscription.public_id === "subscription_coffee",
  );
  assert.ok(prepaid);
  prepaid.prepaid_subscription_context = { prepaid_orders_remaining: 2 };
  const prepaidStore = new CommerceStore(prepaidSeed);
  assert.throws(
    () => prepaidStore.changeSubscriptionQuantity("subscription_coffee", 3),
    (error: unknown) => error instanceof DomainError && error.status === 400,
  );

  const placedSeed = createSeedData();
  const placed = placedSeed.orders.find(
    (order) => order.public_id === "order_upcoming",
  );
  assert.ok(placed);
  placed.status = 5;
  const placedStore = new CommerceStore(placedSeed);
  assert.throws(
    () => placedStore.skipSubscription("order_upcoming", "subscription_coffee"),
    (error: unknown) => error instanceof DomainError && error.status === 400,
  );
});

test("skip moves only one subscription across a multi-subscription order", () => {
  const store = new CommerceStore(createSeedData());
  const source = store.skipSubscription(
    "order_upcoming",
    "subscription_coffee",
  );

  assert.equal(source.public_id, "order_upcoming");
  assert.deepEqual(
    store.listItems({ order: "order_upcoming" }).map((item) => item.public_id),
    ["item_tea"],
  );

  const moved = store.listItems({ subscription: "subscription_coffee" });
  assert.equal(moved.length, 1);
  assert.equal(moved[0]?.order, "order_generated_1");
  assert.equal(store.getOrder("order_generated_1")?.place, "2026-09-30");
});

test("repeated and cross-customer skips reject without mutation", () => {
  const store = new CommerceStore(createSeedData());
  store.skipSubscription("order_upcoming", "subscription_coffee");

  const afterFirst = store.snapshot();
  assert.throws(
    () => store.skipSubscription("order_upcoming", "subscription_coffee"),
    (error: unknown) => error instanceof DomainError && error.status === 400,
  );
  assert.deepEqual(store.snapshot(), afterFirst);

  assert.throws(
    () =>
      store.skipSubscription("order_upcoming", "subscription_other_customer"),
    (error: unknown) => error instanceof DomainError && error.status === 400,
  );
  assert.deepEqual(store.snapshot(), afterFirst);
});
