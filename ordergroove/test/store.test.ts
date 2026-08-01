import assert from "node:assert/strict";
import test from "node:test";
import { Store } from "../_.store.ts";

test("stores customers with clone safety and deterministic transitions", () => {
  const store = new Store();
  const seeded = {
    id: "customer-internal-001",
    public_id: "customer-001",
    merchant_id: "merchant-001",
    merchant_user_id: "user-001",
    first_name: "Ada",
    last_name: "Lovelace",
    email: "ada@example.com",
  };

  store.seedCustomers([seeded]);
  seeded.email = "changed-at-source@example.com";
  const listed = store.listCustomers();
  listed[0]!.email = "changed-in-result@example.com";
  assert.equal(store.getCustomer("customer-001")?.email, "ada@example.com");

  const created = store.createCustomer({ email: "grace@example.com" });
  assert.equal(created.id, "customer-internal-002");
  assert.equal(created.public_id, "customer-002");

  assert.deepEqual(
    store.replaceCustomer("customer-001", {
      id: "ignored",
      public_id: "ignored",
      first_name: "Augusta",
      email: "augusta@example.com",
    }),
    {
      id: "customer-internal-001",
      public_id: "customer-001",
      first_name: "Augusta",
      email: "augusta@example.com",
    },
  );
  assert.equal(store.replaceCustomer("missing", {}), undefined);
});

test("stores items with clone safety, filtering, creation, and deletion", () => {
  const store = new Store();
  store.seedItems([
    {
      id: "item-internal-001",
      public_id: "item-001",
      order_id: "order-001",
      subscription_id: "subscription-001",
      product_id: "product-001",
      quantity: 1,
      price: "19.99",
      total_price: "19.99",
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
      one_time: false,
    },
  ]);

  const filtered = store.listItems({ subscription: "subscription-001" });
  assert.deepEqual(
    filtered.map(({ public_id }) => public_id),
    ["item-001"],
  );
  filtered[0]!.quantity = 99;
  assert.equal(store.getItem("item-001")?.quantity, 1);

  const created = store.createItem({
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
  assert.equal(store.deleteItem("item-003"), true);
  assert.equal(store.getItem("item-003"), undefined);
  assert.equal(store.deleteItem("item-003"), false);
});

test("stores offers with clone safety, discount IDs, and entitlement filtering", () => {
  const store = new Store();
  store.seedOfferProfiles([
    {
      id: "offer-profile-001",
      name: "Subscribe and save",
      description: "Save on recurring deliveries",
    },
  ]);
  const profiles = store.listOfferProfiles();
  profiles[0]!.name = "Changed";
  assert.equal(store.listOfferProfiles()[0]?.name, "Subscribe and save");

  store.seedOneTimeDiscounts([
    {
      id: "discount-001",
      customer_id: "customer-001",
      amount: "5.00",
      type: "fixed",
    },
  ]);
  const discount = store.createOneTimeDiscount({
    customer_id: "customer-002",
    amount: "15.00",
    type: "fixed",
  });
  assert.equal(discount.id, "discount-002");
  discount.amount = "0.00";
  assert.equal(store.listOneTimeDiscounts()[1]?.amount, "15.00");

  store.seedEntitlements([
    {
      id: "entitlement-001",
      customer_id: "customer-001",
      status: "active",
    },
    {
      id: "entitlement-002",
      customer_id: "customer-002",
      status: "expired",
    },
  ]);
  assert.deepEqual(
    store.listEntitlements("customer-002").map(({ id }) => id),
    ["entitlement-002"],
  );
});

test("stores orders with clone safety, filters, cancellation, and send-now", () => {
  const store = new Store();
  store.seedOrders([
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

  const listed = store.listOrders({ customer: "customer-001" });
  assert.deepEqual(
    listed.map(({ public_id }) => public_id),
    ["order-001"],
  );
  listed[0]!.total = "0.00";
  assert.equal(store.getOrder("order-001")?.total, "27.00");

  assert.equal(store.cancelOrder("order-001")?.status, 4);
  const sent = store.sendOrderNow("order-001", "2026-03-01T10:30:00.000Z");
  assert.equal(sent?.place, "2026-03-01T10:30:00.000Z");
  assert.equal(sent?.status, 6);
  assert.deepEqual(store.getOrder("order-001"), sent);
  assert.equal(store.cancelOrder("missing"), undefined);
});

test("stores products with clone safety and replacement semantics", () => {
  const store = new Store();
  const seeded = {
    id: "product-001",
    price: "19.99",
    external_product_id: "sku-coffee",
    autoship_enabled: true,
  };
  store.seedProducts([seeded]);
  seeded.price = "0.01";
  const listed = store.listProducts();
  listed[0]!.price = "0.00";
  assert.equal(store.getProduct("product-001")?.price, "19.99");

  assert.deepEqual(
    store.replaceProduct("product-001", {
      id: "ignored",
      price: "21.50",
      autoship_enabled: false,
    }),
    {
      id: "product-001",
      price: "21.50",
      autoship_enabled: false,
    },
  );
  assert.equal(store.replaceProduct("missing", { price: "1.00" }), undefined);
});

test("stores subscriptions with clone safety, filters, and lifecycle transitions", () => {
  const store = new Store();
  store.seedSubscriptions([
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

  const filtered = store.listSubscriptions({
    customer: "customer-001",
    live: "true",
    created_start: "2026-01-15",
    created_end: "2026-01-15",
  });
  assert.deepEqual(
    filtered.map(({ public_id }) => public_id),
    ["subscription-001"],
  );
  filtered[0]!.quantity = 99;
  assert.equal(store.getSubscription("subscription-001")?.quantity, 1);

  const replaced = store.replaceSubscription("subscription-001", {
    id: "ignored",
    public_id: "ignored",
    customer_id: "customer-002",
    product_id: "product-002",
    quantity: 4,
    every: 3,
    every_period: "month",
    live: true,
  });
  assert.equal(replaced?.id, "subscription-internal-001");
  assert.equal(replaced?.public_id, "subscription-001");
  assert.equal(store.cancelSubscription("subscription-001")?.live, false);
  assert.equal(store.reactivateSubscription("subscription-001")?.live, true);
  assert.equal(
    store.changeSubscriptionFrequency("subscription-001", {
      every: 6,
      every_period: "week",
    })?.every,
    6,
  );
  assert.equal(store.replaceSubscription("missing", {}), undefined);
});
