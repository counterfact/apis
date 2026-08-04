import assert from "node:assert/strict";
import net from "node:net";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { counterfact } from "counterfact";
import {
  address,
  customer,
  item,
  order,
  payment,
  product,
} from "../domain/fixtures.js";
import { Context } from "../routes/_.context.js";
import {
  crossCustomerReferences,
  happyPath,
  inactivePayment,
  monthEndSubscription,
  multipleSubscriptions,
  placedOrder,
  prepaidSubscription,
} from "../scenarios/index.js";
import type { Address } from "../types/components/schemas/Address.js";
import type { AddressPage } from "../types/components/schemas/AddressPage.js";
import type { Customer } from "../types/components/schemas/Customer.js";
import type { Item } from "../types/components/schemas/Item.js";
import type { ItemPage } from "../types/components/schemas/ItemPage.js";
import type { Order } from "../types/components/schemas/Order.js";
import type { OrderPage } from "../types/components/schemas/OrderPage.js";
import type { Payment } from "../types/components/schemas/Payment.js";
import type { PaymentPage } from "../types/components/schemas/PaymentPage.js";
import type { Product } from "../types/components/schemas/Product.js";
import type { Subscription } from "../types/components/schemas/Subscription.js";
import type { SubscriptionPage } from "../types/components/schemas/SubscriptionPage.js";
import type { Scenario$ } from "../types/_.context.js";

const basePath = fileURLToPath(new URL("../", import.meta.url));
const openApiPath = fileURLToPath(new URL("../openapi.yaml", import.meta.url));
const apiKey = "ordergroove-simulator-key";

let port: number;
let server: { stop(): Promise<void> } | undefined;
let context: Context;

const request = (pathname: string, apiKeyOverride: string | null = apiKey) =>
  fetch(`http://127.0.0.1:${port}${pathname}`, {
    headers: apiKeyOverride === null ? {} : { "x-api-key": apiKeyOverride },
  });

const mutate = (pathname: string, body: unknown) =>
  fetch(`http://127.0.0.1:${port}${pathname}`, {
    method: "PATCH",
    headers: {
      "content-type": "application/json",
      "x-api-key": apiKey,
    },
    body: JSON.stringify(body),
  });

const createCustomer = (body: unknown) =>
  fetch(`http://127.0.0.1:${port}/customers/create/`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-api-key": apiKey,
    },
    body: JSON.stringify(body),
  });

const scenarioArgument = (): Scenario$ =>
  ({
    context,
    loadContext: () => context,
    route: () => ({}),
    routes: {},
  }) as unknown as Scenario$;

const getFreePort = async () =>
  new Promise<number>((resolve, reject) => {
    const temporaryServer = net.createServer();
    temporaryServer.listen(0, "127.0.0.1", () => {
      const address = temporaryServer.address();
      if (address && typeof address === "object") resolve(address.port);
      else reject(new Error("failed to determine free port"));
      temporaryServer.close();
    });
    temporaryServer.on("error", reject);
  });

const waitForServer = async () => {
  for (let attempt = 0; attempt < 60; attempt += 1) {
    try {
      const response = await request("/customers/customer_demo/");
      if (response.status === 200) return;
    } catch {
      // Server startup races are expected here.
    }
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
  throw new Error("counterfact server did not start in time");
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

  const app = await counterfact(config);
  server = await app.start(config);
  context = app.contextRegistry.find("/") as Context;
  happyPath({
    context,
    loadContext: (path: string) => app.contextRegistry.find(path),
    route: () => ({}),
    routes: {},
  } as unknown as Scenario$);
  await waitForServer();
});

test.after(async () => {
  await server?.stop();
});

test("rejects missing and invalid simulator credentials", async () => {
  for (const credential of [null, "not-the-simulator-key"]) {
    const response = await request("/customers/customer_demo/", credential);
    assert.equal(response.status, 403);
    assert.deepEqual(await response.json(), {
      detail: "Authentication Failed",
    });
  }
});

test("supports the customer to subscription to order workflow", async () => {
  const customerResponse = await request("/customers/customer_demo/");
  assert.equal(customerResponse.status, 200);
  const customer = (await customerResponse.json()) as Customer;
  assert.equal(customer.merchant_user_id, "customer_demo");

  const subscriptionResponse = await request(
    "/subscriptions/?customer=customer_demo",
  );
  assert.equal(subscriptionResponse.status, 200);
  const subscriptions = (await subscriptionResponse.json()) as SubscriptionPage;
  assert.equal(subscriptions.results.length, 1);
  assert.equal(subscriptions.results[0].public_id, "subscription_demo");

  const ordersResponse = await request(
    "/orders/?subscription=subscription_demo",
  );
  assert.equal(ordersResponse.status, 200);
  const orders = (await ordersResponse.json()) as OrderPage;
  assert.equal(orders.results.length, 1);
  assert.equal(orders.results[0].public_id, "order_upcoming");
});

test("retrieve handlers return contract-shaped not found errors", async () => {
  for (const pathname of [
    "/addresses/missing/",
    "/customers/missing/",
    "/items/missing/",
    "/payments/missing/",
    "/products/missing/",
    "/subscriptions/missing/",
    "/orders/missing/",
  ]) {
    const response = await request(pathname);
    assert.equal(response.status, 404);
    assert.deepEqual(await response.json(), {
      detail: "Unable to find requested asset.",
    });
  }
});

test("supports all remaining read endpoints and their direct filters", async () => {
  const addressesResponse = await request(
    "/addresses/?customer=customer_demo&live=true",
  );
  assert.equal(addressesResponse.status, 200);
  const addresses = (await addressesResponse.json()) as AddressPage;
  assert.equal(addresses.results[0].public_id, "address_home");

  const addressResponse = await request("/addresses/address_home/");
  assert.equal(addressResponse.status, 200);
  const address = (await addressResponse.json()) as Address;
  assert.equal(address.customer, "customer_demo");

  const updatedAddressResponse = await request(
    "/addresses/?updated_start=2026-08-03",
  );
  const updatedAddresses = (await updatedAddressResponse.json()) as AddressPage;
  assert.deepEqual(updatedAddresses.results, []);

  const paymentsResponse = await request("/payments/?customer=customer_demo");
  assert.equal(paymentsResponse.status, 200);
  const payments = (await paymentsResponse.json()) as PaymentPage;
  assert.equal(payments.results[0].public_id, "payment_primary");

  const paymentResponse = await request("/payments/payment_primary/");
  assert.equal(paymentResponse.status, 200);
  const payment = (await paymentResponse.json()) as Payment;
  assert.equal(payment.billing_address, "address_home");

  const productResponse = await request(
    "/products/coffee_demo/?include_product_selection_rules=true",
  );
  assert.equal(productResponse.status, 200);
  const product = (await productResponse.json()) as Product;
  assert.equal(product.external_product_id, "coffee_demo");

  const itemsResponse = await request(
    "/items/?order=order_upcoming&subscription=subscription_demo&product=coffee_demo&one_time=false&status=1&place=2026-09-01",
  );
  assert.equal(itemsResponse.status, 200);
  const items = (await itemsResponse.json()) as ItemPage;
  assert.equal(items.results[0].public_id, "item_demo");

  const itemResponse = await request("/items/item_demo/");
  assert.equal(itemResponse.status, 200);
  const item = (await itemResponse.json()) as Item;
  assert.equal(item.subscription, "subscription_demo");

  const afterPlaceResponse = await request("/items/?place_start=2026-10-01");
  const afterPlaceItems = (await afterPlaceResponse.json()) as ItemPage;
  assert.deepEqual(afterPlaceItems.results, []);
});

test("applies documented item and order presentation controls", async () => {
  context.reset({
    customers: [customer()],
    addresses: [address()],
    payments: [payment()],
    products: [product({ product_type: "plan" })],
    subscriptions: [],
    orders: [order()],
    items: [
      item({
        offer: "offer_demo",
        incentives: [{ public_id: "incentive_demo" }],
      }),
    ],
  });

  const itemsResponse = await request(
    "/items/?offer=offer_demo&order_updated_start=2026-08-02&include_incentives=true",
  );
  const items = (await itemsResponse.json()) as ItemPage;
  assert.deepEqual(items.results[0].incentives, [
    { public_id: "incentive_demo" },
  ]);

  const omittedItemsResponse = await request(
    "/items/?omit_price_calculation=true",
  );
  const omittedItems = (await omittedItemsResponse.json()) as ItemPage;
  assert.equal("price" in omittedItems.results[0], false);
  assert.equal("total_cost" in omittedItems.results[0], false);
  assert.equal("extra_cost" in omittedItems.results[0], false);

  const omittedItemResponse = await request(
    "/items/item_demo/?omit_price_calculation=true",
  );
  const omittedItem = (await omittedItemResponse.json()) as Item;
  assert.equal("price" in omittedItem, false);

  const ordersResponse = await request(
    "/orders/?created=2026-08-02&updated_start=2026-08-02&include_has_plan=true",
  );
  const orders = (await ordersResponse.json()) as OrderPage;
  assert.equal(orders.results[0].has_plan, true);

  const orderResponse = await request(
    "/orders/order_upcoming/?include_has_plan=true",
  );
  const upcomingOrder = (await orderResponse.json()) as Order;
  assert.equal(upcomingOrder.has_plan, true);

  happyPath(scenarioArgument());
});

test("read scenarios expose explicit unusual state without lifecycle rules", async () => {
  multipleSubscriptions(scenarioArgument());
  const multipleItemsResponse = await request("/items/?status=1");
  const multipleItems = (await multipleItemsResponse.json()) as ItemPage;
  assert.deepEqual(
    multipleItems.results.map((entry) => entry.public_id),
    ["item_demo", "item_tea"],
  );

  inactivePayment(scenarioArgument());
  const inactivePaymentResponse = await request("/payments/payment_primary/");
  const inactivePaymentRecord =
    (await inactivePaymentResponse.json()) as Payment;
  assert.equal(inactivePaymentRecord.live, false);

  crossCustomerReferences(scenarioArgument());
  const crossReferencedSubscription = await request(
    "/subscriptions/subscription_demo/",
  );
  const crossReferenced =
    (await crossReferencedSubscription.json()) as Subscription;
  assert.equal(crossReferenced.shipping_address, "address_other");

  happyPath(scenarioArgument());
});

test("creates customers and applies simple direct relationship changes", async () => {
  const createdCustomer = customer({
    merchant_user_id: "customer_new",
    email: "new@example.invalid",
  });
  const createResponse = await createCustomer(createdCustomer);
  assert.equal(createResponse.status, 200);
  assert.equal(
    ((await createResponse.json()) as Customer).merchant_user_id,
    "customer_new",
  );
  assert.ok(
    context.state.customers.some(
      (entry) => entry.merchant_user_id === "customer_new",
    ),
  );

  const duplicateResponse = await createCustomer(createdCustomer);
  assert.equal(duplicateResponse.status, 400);
  assert.deepEqual(await duplicateResponse.json(), {
    detail: "Customer already exists.",
  });

  context.state.addresses.push(address({ public_id: "address_work" }));
  context.state.payments.push(
    payment({ public_id: "payment_backup", billing_address: "address_work" }),
  );

  const quantityResponse = await mutate(
    "/subscriptions/subscription_demo/change_quantity/",
    { quantity: 3 },
  );
  assert.equal(quantityResponse.status, 200);
  assert.equal(((await quantityResponse.json()) as Subscription).quantity, 3);
  assert.equal(context.state.items[0].quantity, 3);

  const subscriptionShippingResponse = await mutate(
    "/subscriptions/subscription_demo/change_shipping/",
    { shipping_address: "address_work" },
  );
  assert.equal(subscriptionShippingResponse.status, 200);
  assert.equal(
    ((await subscriptionShippingResponse.json()) as Subscription)
      .shipping_address,
    "address_work",
  );

  const subscriptionPaymentResponse = await mutate(
    "/subscriptions/subscription_demo/change_payment/",
    { payment: "payment_backup" },
  );
  assert.equal(subscriptionPaymentResponse.status, 200);
  assert.equal(
    ((await subscriptionPaymentResponse.json()) as Subscription).payment,
    "payment_backup",
  );

  const orderShippingResponse = await mutate(
    "/orders/order_upcoming/change_shipping/",
    { shipping_address: "address_work" },
  );
  assert.equal(orderShippingResponse.status, 200);
  assert.equal(
    ((await orderShippingResponse.json()) as Order).shipping_address,
    "address_work",
  );

  const orderPaymentResponse = await mutate(
    "/orders/order_upcoming/change_payment/",
    { payment: "payment_backup" },
  );
  assert.equal(orderPaymentResponse.status, 200);
  assert.equal(
    ((await orderPaymentResponse.json()) as Order).payment,
    "payment_backup",
  );

  crossCustomerReferences(scenarioArgument());
  const invalidReferenceResponse = await mutate(
    "/subscriptions/subscription_demo/change_shipping/",
    { shipping_address: "address_other" },
  );
  assert.equal(invalidReferenceResponse.status, 400);
  assert.deepEqual(await invalidReferenceResponse.json(), {
    detail: "Invalid shipping address.",
  });

  const unknownSubscriptionResponse = await mutate(
    "/subscriptions/missing/change_payment/",
    { payment: "payment_primary" },
  );
  assert.equal(unknownSubscriptionResponse.status, 404);

  happyPath(scenarioArgument());
});

test("skips matching unsent items with deterministic next-order fixtures", async () => {
  const skipResponse = await mutate(
    "/orders/order_upcoming/skip_subscription/",
    { subscription: "subscription_demo" },
  );
  assert.equal(skipResponse.status, 200);
  assert.equal(
    ((await skipResponse.json()) as Order).public_id,
    "order_upcoming",
  );
  assert.deepEqual(
    context.state.items.filter((entry) => entry.order === "order_upcoming"),
    [],
  );
  assert.equal(
    context.state.items[0].order,
    "order_upcoming-skip-subscription_demo",
  );
  const generatedOrder = context.state.orders.find(
    (entry) => entry.public_id === "order_upcoming-skip-subscription_demo",
  );
  assert.equal(generatedOrder?.place, "2026-10-01");

  const repeatedSkip = await mutate(
    "/orders/order_upcoming/skip_subscription/",
    { subscription: "subscription_demo" },
  );
  assert.equal(repeatedSkip.status, 400);
  assert.deepEqual(await repeatedSkip.json(), {
    detail: "Subscription is not in this order.",
  });

  const missingOrder = await mutate("/orders/missing/skip_subscription/", {
    subscription: "subscription_demo",
  });
  assert.equal(missingOrder.status, 404);

  happyPath(scenarioArgument());
  const missingSubscription = await mutate(
    "/orders/order_upcoming/skip_subscription/",
    { subscription: "missing" },
  );
  assert.equal(missingSubscription.status, 400);

  prepaidSubscription(scenarioArgument());
  const prepaidQuantity = await mutate(
    "/subscriptions/subscription_demo/change_quantity/",
    { quantity: 2 },
  );
  assert.equal(prepaidQuantity.status, 400);
  assert.equal(context.state.subscriptions[0].quantity, 1);

  placedOrder(scenarioArgument());
  const placedSkip = await mutate("/orders/order_upcoming/skip_subscription/", {
    subscription: "subscription_demo",
  });
  assert.equal(placedSkip.status, 400);
  assert.equal(context.state.items[0].order, "order_upcoming");

  monthEndSubscription(scenarioArgument());
  const monthEndSkip = await mutate(
    "/orders/order_upcoming/skip_subscription/",
    { subscription: "subscription_demo" },
  );
  assert.equal(monthEndSkip.status, 200);
  assert.equal(
    context.state.orders.find(
      (entry) => entry.public_id === "order_upcoming-skip-subscription_demo",
    )?.place,
    "2026-02-28",
  );

  happyPath(scenarioArgument());
});

test("every documented operation accepts a contract-valid request", async () => {
  happyPath(scenarioArgument());
  context.state.addresses.push(address({ public_id: "address_matrix" }));
  context.state.payments.push(
    payment({ public_id: "payment_matrix", billing_address: "address_matrix" }),
  );

  const operations: Array<() => Promise<Response>> = [
    () => request("/addresses/"),
    () => request("/addresses/address_home/"),
    () => request("/payments/"),
    () => request("/payments/payment_primary/"),
    () => request("/customers/"),
    () =>
      createCustomer(
        customer({
          merchant_user_id: "customer_matrix",
          email: "matrix@example.invalid",
        }),
      ),
    () => request("/customers/customer_demo/"),
    () => request("/products/coffee_demo/"),
    () => request("/subscriptions/"),
    () => request("/subscriptions/subscription_demo/"),
    () =>
      mutate("/subscriptions/subscription_demo/change_quantity/", {
        quantity: 2,
      }),
    () =>
      mutate("/subscriptions/subscription_demo/change_shipping/", {
        shipping_address: "address_matrix",
      }),
    () =>
      mutate("/subscriptions/subscription_demo/change_payment/", {
        payment: "payment_matrix",
      }),
    () => request("/orders/"),
    () => request("/orders/order_upcoming/"),
    () =>
      mutate("/orders/order_upcoming/change_shipping/", {
        shipping_address: "address_matrix",
      }),
    () =>
      mutate("/orders/order_upcoming/change_payment/", {
        payment: "payment_matrix",
      }),
    () => request("/items/"),
    () => request("/items/item_demo/"),
    () =>
      mutate("/orders/order_upcoming/skip_subscription/", {
        subscription: "subscription_demo",
      }),
  ];

  for (const operation of operations) {
    const response = await operation();
    assert.equal(response.status, 200, `expected ${response.url} to succeed`);
  }

  happyPath(scenarioArgument());
});

test("pagination is deterministic and links stay on the local origin", async () => {
  context.state.orders.push(
    order({ public_id: "order_second", place: "2026-10-01" }),
  );

  const firstResponse = await request(
    "/orders/?customer=customer_demo&page_size=1",
  );
  const first = (await firstResponse.json()) as OrderPage;
  assert.equal(first.results[0].public_id, "order_upcoming");
  assert.ok(first.next);
  assert.match(
    first.next,
    new RegExp(`^http://127\\.0\\.0\\.1:${port}/orders/`),
  );
  assert.equal(first.next.includes("restapi.ordergroove.com"), false);

  const nextUrl = new URL(first.next);
  const secondResponse = await request(`${nextUrl.pathname}${nextUrl.search}`);
  const second = (await secondResponse.json()) as OrderPage;
  assert.equal(second.results[0].public_id, "order_second");
  assert.notEqual(second.previous, null);

  happyPath(scenarioArgument());
  assert.equal(context.state.orders.length, 1);
});
