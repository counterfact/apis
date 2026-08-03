/** @typedef {import("../routes/_.context.js").State} State */
/** @typedef {import("../types/components/schemas/Address.js").Address} Address */
/** @typedef {import("../types/components/schemas/Customer.js").Customer} Customer */
/** @typedef {import("../types/components/schemas/Item.js").Item} Item */
/** @typedef {import("../types/components/schemas/Order.js").Order} Order */
/** @typedef {import("../types/components/schemas/Payment.js").Payment} Payment */
/** @typedef {import("../types/components/schemas/Product.js").Product} Product */
/** @typedef {import("../types/components/schemas/Subscription.js").Subscription} Subscription */

const timestamp = "2026-08-02 12:00:00";

/** @param {Partial<Customer>} [overrides] @returns {Customer} */
export const customer = (overrides = {}) => ({
  merchant: "merchant_demo",
  merchant_user_id: "customer_demo",
  session_id: "merchant_demo.session_demo",
  user_token_id: "",
  first_name: "Ada",
  last_name: "Example",
  email: "ada@example.invalid",
  phone_number: "+15555550100",
  phone_type: "mobile",
  live: true,
  created: timestamp,
  last_updated: timestamp,
  last_login: null,
  locale: "en-US",
  ...overrides,
});

/** @param {Partial<Address>} [overrides] @returns {Address} */
export const address = (overrides = {}) => ({
  customer: "customer_demo",
  public_id: "address_home",
  label: "Home",
  first_name: "Ada",
  last_name: "Example",
  address: "1 Example Way",
  address2: "",
  city: "Exampleville",
  state_province_code: "NY",
  zip_postal_code: "10001",
  phone: "+15555550100",
  country_code: "US",
  live: true,
  created: timestamp,
  updated: timestamp,
  ...overrides,
});

/** @param {Partial<Payment>} [overrides] @returns {Payment} */
export const payment = (overrides = {}) => ({
  customer: "customer_demo",
  billing_address: "address_home",
  cc_number_ending: "1111",
  public_id: "payment_primary",
  label: "Primary",
  token_id: "simulator-token-primary",
  cc_holder: "Ada Example",
  cc_type: 1,
  cc_exp_date: "11/2028",
  payment_method: "credit card",
  live: true,
  created: timestamp,
  last_updated: timestamp,
  ...overrides,
});

/** @param {Partial<Product>} [overrides] @returns {Product} */
export const product = (overrides = {}) => ({
  merchant: "merchant_demo",
  external_product_id: "coffee_demo",
  name: "Example Coffee",
  price: "18.00",
  autoship_enabled: true,
  discontinued: false,
  ...overrides,
});

/** @param {Partial<Subscription>} [overrides] @returns {Subscription} */
export const subscription = (overrides = {}) => ({
  customer: "customer_demo",
  merchant: "merchant_demo",
  product: "coffee_demo",
  payment: "payment_primary",
  shipping_address: "address_home",
  public_id: "subscription_demo",
  quantity: 1,
  price: "18.00",
  frequency_days: 30,
  every: 1,
  every_period: 3,
  start_date: "2026-08-02",
  created: timestamp,
  updated: timestamp,
  live: true,
  ...overrides,
});

/** @param {Partial<Order>} [overrides] @returns {Order} */
export const order = (overrides = {}) => ({
  merchant: "merchant_demo",
  customer: "customer_demo",
  payment: "payment_primary",
  shipping_address: "address_home",
  public_id: "order_upcoming",
  sub_total: "18.00",
  tax_total: "0.00",
  shipping_total: "0.00",
  discount_total: "0.00",
  total: "18.00",
  created: timestamp,
  updated: timestamp,
  place: "2026-09-01",
  status: 1,
  ...overrides,
});

/** @param {Partial<Item>} [overrides] @returns {Item} */
export const item = (overrides = {}) => ({
  public_id: "item_demo",
  order: "order_upcoming",
  subscription: "subscription_demo",
  product: "coffee_demo",
  quantity: 1,
  price: "18.00",
  total_cost: "18.00",
  one_time: false,
  ...overrides,
});

/** @returns {State} */
export const happyPathState = () => ({
  customers: [customer()],
  addresses: [address()],
  payments: [payment()],
  products: [product()],
  subscriptions: [subscription()],
  orders: [order()],
  items: [item()],
});

/** @returns {State} */
export const emptyAccountState = () => ({
  customers: [customer()],
  addresses: [],
  payments: [],
  products: [],
  subscriptions: [],
  orders: [],
  items: [],
});
