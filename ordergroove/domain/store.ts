import type { Address } from "../types/components/schemas/Address.ts";
import type { CustomerCreate } from "../types/components/schemas/CustomerCreate.ts";
import type { Customer } from "../types/components/schemas/Customer.ts";
import type { Item } from "../types/components/schemas/Item.ts";
import type { Order } from "../types/components/schemas/Order.ts";
import type { Payment } from "../types/components/schemas/Payment.ts";
import type { Product } from "../types/components/schemas/Product.ts";
import type { Subscription } from "../types/components/schemas/Subscription.ts";
import { addRecurrence } from "./recurrence.ts";

export interface CommerceState {
  customers: Customer[];
  addresses: Address[];
  payments: Payment[];
  products: Product[];
  subscriptions: Subscription[];
  orders: Order[];
  items: Item[];
  nextGeneratedOrder: number;
}

export class DomainError extends Error {
  constructor(
    readonly status: 400 | 404,
    message: string,
  ) {
    super(message);
  }
}

const clone = <Value>(value: Value): Value => structuredClone(value);
const fixedTimestamp = "2026-08-02 12:00:00";

export const createSeedData = (): CommerceState => ({
  customers: [
    {
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
      created: fixedTimestamp,
      last_updated: fixedTimestamp,
      last_login: null,
      extra_data: null,
      locale: "en-US",
    },
    {
      merchant: "merchant_demo",
      merchant_user_id: "customer_other",
      session_id: "merchant_demo.session_other",
      user_token_id: "",
      first_name: "Grace",
      last_name: "Example",
      email: "grace@example.invalid",
      phone_number: "+15555550101",
      phone_type: "mobile",
      live: true,
      created: fixedTimestamp,
      last_updated: fixedTimestamp,
      last_login: null,
      extra_data: null,
      locale: "en-US",
    },
  ],
  addresses: [
    {
      customer: "customer_demo",
      public_id: "address_demo",
      label: "Home",
      first_name: "Ada",
      last_name: "Example",
      company_name: null,
      address: "100 Example Avenue",
      address2: null,
      city: "New York",
      state_province_code: "NY",
      zip_postal_code: "10001",
      phone: "+15555550100",
      fax: null,
      country_code: "US",
      live: true,
      created: fixedTimestamp,
      updated: fixedTimestamp,
      token_id: null,
      store_public_id: null,
    },
    {
      customer: "customer_demo",
      public_id: "address_alternate",
      label: "Office",
      first_name: "Ada",
      last_name: "Example",
      company_name: "Example Co",
      address: "200 Alternate Street",
      address2: "Suite 2",
      city: "Brooklyn",
      state_province_code: "NY",
      zip_postal_code: "11201",
      phone: "+15555550100",
      fax: null,
      country_code: "US",
      live: true,
      created: fixedTimestamp,
      updated: fixedTimestamp,
      token_id: null,
      store_public_id: null,
    },
    {
      customer: "customer_other",
      public_id: "address_other_customer",
      label: "Home",
      first_name: "Grace",
      last_name: "Example",
      company_name: null,
      address: "300 Other Road",
      address2: null,
      city: "Arlington",
      state_province_code: "VA",
      zip_postal_code: "22201",
      phone: "+15555550101",
      fax: null,
      country_code: "US",
      live: true,
      created: fixedTimestamp,
      updated: fixedTimestamp,
      token_id: null,
      store_public_id: null,
    },
  ],
  payments: [
    {
      customer: "customer_demo",
      billing_address: "address_demo",
      cc_number_ending: "4242",
      public_id: "payment_demo",
      label: "Primary Visa",
      token_id: "token_demo",
      cc_holder: "Ada Example",
      cc_type: 1,
      cc_exp_date: "12/2030",
      payment_method: "credit card",
      live: true,
      created: fixedTimestamp,
      last_updated: fixedTimestamp,
    },
    {
      customer: "customer_demo",
      billing_address: "address_alternate",
      cc_number_ending: "1111",
      public_id: "payment_alternate",
      label: "Alternate Mastercard",
      token_id: "token_alternate",
      cc_holder: "Ada Example",
      cc_type: 2,
      cc_exp_date: "11/2031",
      payment_method: "credit card",
      live: true,
      created: fixedTimestamp,
      last_updated: fixedTimestamp,
    },
    {
      customer: "customer_other",
      billing_address: "address_other_customer",
      cc_number_ending: "0005",
      public_id: "payment_other_customer",
      label: "Other Amex",
      token_id: "token_other",
      cc_holder: "Grace Example",
      cc_type: 3,
      cc_exp_date: "10/2032",
      payment_method: "credit card",
      live: true,
      created: fixedTimestamp,
      last_updated: fixedTimestamp,
    },
  ],
  products: [
    {
      merchant: "merchant_demo",
      external_product_id: "coffee_demo",
      name: "Example Coffee",
      price: "18.00",
      autoship_enabled: true,
      discontinued: false,
    },
    {
      merchant: "merchant_demo",
      external_product_id: "tea_demo",
      name: "Example Tea",
      price: "12.00",
      autoship_enabled: true,
      discontinued: false,
    },
  ],
  subscriptions: [
    {
      customer: "customer_demo",
      merchant: "merchant_demo",
      product: "coffee_demo",
      payment: "payment_demo",
      shipping_address: "address_demo",
      public_id: "subscription_coffee",
      quantity: 2,
      price: "18.00",
      frequency_days: 30,
      reminder_days: 10,
      every: 1,
      every_period: 3,
      start_date: "2026-07-31",
      created: fixedTimestamp,
      updated: fixedTimestamp,
      live: true,
      components: [],
      prepaid_subscription_context: {},
    },
    {
      customer: "customer_demo",
      merchant: "merchant_demo",
      product: "tea_demo",
      payment: "payment_demo",
      shipping_address: "address_demo",
      public_id: "subscription_tea",
      quantity: 1,
      price: "12.00",
      frequency_days: 14,
      every: 2,
      every_period: 2,
      start_date: "2026-08-17",
      created: fixedTimestamp,
      updated: fixedTimestamp,
      live: true,
      components: [],
      prepaid_subscription_context: {},
    },
    {
      customer: "customer_other",
      merchant: "merchant_demo",
      product: "coffee_demo",
      payment: "payment_other_customer",
      shipping_address: "address_other_customer",
      public_id: "subscription_other_customer",
      quantity: 1,
      frequency_days: 30,
      every: 1,
      every_period: 3,
      start_date: "2026-08-01",
      created: fixedTimestamp,
      updated: fixedTimestamp,
      live: true,
      components: [],
      prepaid_subscription_context: {},
    },
  ],
  orders: [
    {
      merchant: "merchant_demo",
      customer: "customer_demo",
      payment: "payment_demo",
      shipping_address: "address_demo",
      public_id: "order_upcoming",
      created: fixedTimestamp,
      updated: fixedTimestamp,
      place: "2026-08-31",
      status: 1,
      sub_total: "48.00",
      tax_total: "0.00",
      shipping_total: "0.00",
      discount_total: "0.00",
      total: "48.00",
      tries: 0,
      generic_error_count: 0,
      type: 1,
    },
  ],
  items: [
    {
      public_id: "item_coffee",
      order: "order_upcoming",
      subscription: "subscription_coffee",
      product: "coffee_demo",
      quantity: 2,
      price: "18.00",
      total_cost: "36.00",
      extra_cost: "0.00",
      one_time: false,
      components: [],
    },
    {
      public_id: "item_tea",
      order: "order_upcoming",
      subscription: "subscription_tea",
      product: "tea_demo",
      quantity: 1,
      price: "12.00",
      total_cost: "12.00",
      extra_cost: "0.00",
      one_time: false,
      components: [],
    },
  ],
  nextGeneratedOrder: 1,
});

export class CommerceStore {
  private state: CommerceState;

  constructor(seed: CommerceState = createSeedData()) {
    this.state = clone(seed);
    this.assertIntegrity(this.state);
  }

  reset(seed: CommerceState = createSeedData()) {
    const next = clone(seed);
    this.assertIntegrity(next);
    this.state = next;
  }

  snapshot() {
    return clone(this.state);
  }

  getCustomer(id: string) {
    const value = this.state.customers.find(
      (customer) => customer.merchant_user_id === id,
    );
    return value ? clone(value) : undefined;
  }

  listCustomers(
    filters: { email?: string | undefined; live?: string | undefined } = {},
  ) {
    return clone(
      this.state.customers.filter(
        (customer) =>
          (!filters.email || customer.email === filters.email) &&
          (!filters.live ||
            String(customer.live).toLowerCase() === filters.live.toLowerCase()),
      ),
    );
  }

  createCustomer(input: CustomerCreate) {
    if (this.getCustomer(input.merchant_user_id)) {
      throw new DomainError(400, "Customer already exists.");
    }
    if (input.merchant !== "merchant_demo") {
      throw new DomainError(
        400,
        "Customer merchant does not match authenticated merchant.",
      );
    }
    const customer = clone(input);
    this.state.customers.push(customer);
    return clone(customer);
  }

  getAddress(id: string) {
    const value = this.state.addresses.find(
      (address) => address.public_id === id,
    );
    return value ? clone(value) : undefined;
  }

  listAddresses(
    filters: {
      customer?: string | undefined;
      live?: boolean | undefined;
    } = {},
  ) {
    return clone(
      this.state.addresses.filter(
        (address) =>
          (!filters.customer || address.customer === filters.customer) &&
          (filters.live === undefined || address.live === filters.live),
      ),
    );
  }

  getPayment(id: string) {
    const value = this.state.payments.find(
      (payment) => payment.public_id === id,
    );
    return value ? clone(value) : undefined;
  }

  listPayments(filters: { customer?: string | undefined } = {}) {
    return clone(
      this.state.payments.filter(
        (payment) => !filters.customer || payment.customer === filters.customer,
      ),
    );
  }

  getProduct(id: string) {
    const value = this.state.products.find(
      (product) => product.external_product_id === id,
    );
    return value ? clone(value) : undefined;
  }

  getSubscription(id: string) {
    const value = this.state.subscriptions.find(
      (subscription) => subscription.public_id === id,
    );
    return value ? clone(value) : undefined;
  }

  listSubscriptions(
    filters: {
      customer?: string | undefined;
      product?: string | undefined;
      live?: boolean[] | undefined;
    } = {},
  ) {
    return clone(
      this.state.subscriptions.filter(
        (subscription) =>
          (!filters.customer || subscription.customer === filters.customer) &&
          (!filters.product || subscription.product === filters.product) &&
          (!filters.live?.length || filters.live.includes(subscription.live)),
      ),
    );
  }

  /**
   * Source: https://developer.ordergroove.com/reference/subscriptions-change-quantity
   * Updating materialized status-1 items is a documented simulator convention.
   */
  changeSubscriptionQuantity(id: string, quantity: number) {
    const subscription = this.state.subscriptions.find(
      (candidate) => candidate.public_id === id,
    );
    if (!subscription) throw new DomainError(404, "Subscription not found.");
    if (!Number.isInteger(quantity) || quantity < 1) {
      throw new DomainError(400, "Quantity must be a positive integer.");
    }
    if (
      subscription.prepaid_subscription_context &&
      Object.keys(subscription.prepaid_subscription_context).length > 0
    ) {
      throw new DomainError(
        400,
        "Prepaid subscriptions cannot change quantity.",
      );
    }

    subscription.quantity = quantity;
    subscription.updated = fixedTimestamp;
    for (const item of this.state.items) {
      const order = this.state.orders.find(
        (candidate) => candidate.public_id === item.order,
      );
      if (item.subscription === id && order?.status === 1)
        item.quantity = quantity;
    }
    return clone(subscription);
  }

  /**
   * Sources: https://developer.ordergroove.com/reference/subscriptions-change-shipping-address
   * and https://developer.ordergroove.com/reference/subscriptions-change-payment
   * Requiring live, same-customer associations is a simulator convention.
   */
  changeSubscriptionShippingAddress(id: string, addressId: string) {
    const subscription = this.requireSubscription(id);
    this.requireLiveCustomerAddress(addressId, subscription.customer);
    subscription.shipping_address = addressId;
    subscription.updated = fixedTimestamp;
    return clone(subscription);
  }

  changeSubscriptionPayment(id: string, paymentId: string) {
    const subscription = this.requireSubscription(id);
    this.requireLiveCustomerPayment(paymentId, subscription.customer);
    subscription.payment = paymentId;
    subscription.updated = fixedTimestamp;
    return clone(subscription);
  }

  getOrder(id: string) {
    const value = this.state.orders.find((order) => order.public_id === id);
    return value ? clone(value) : undefined;
  }

  listOrders(
    filters: {
      customer?: string | undefined;
      subscription?: string | undefined;
      status?: number | undefined;
    } = {},
  ) {
    return clone(
      this.state.orders.filter((order) => {
        const hasSubscription = this.state.items.some(
          (item) =>
            item.order === order.public_id &&
            item.subscription === filters.subscription,
        );
        return (
          (!filters.customer || order.customer === filters.customer) &&
          (!filters.subscription || hasSubscription) &&
          (filters.status === undefined || order.status === filters.status)
        );
      }),
    );
  }

  /**
   * Sources: https://developer.ordergroove.com/reference/orders-change-shipping-address
   * and https://developer.ordergroove.com/reference/orders-change-payment
   * Requiring live, same-customer associations is a simulator convention.
   */
  changeOrderShippingAddress(id: string, addressId: string) {
    const order = this.requireOrder(id);
    this.requireLiveCustomerAddress(addressId, order.customer);
    order.shipping_address = addressId;
    order.updated = fixedTimestamp;
    return clone(order);
  }

  changeOrderPayment(id: string, paymentId: string) {
    const order = this.requireOrder(id);
    this.requireLiveCustomerPayment(paymentId, order.customer);
    order.payment = paymentId;
    order.updated = fixedTimestamp;
    return clone(order);
  }

  getItem(id: string) {
    const value = this.state.items.find((item) => item.public_id === id);
    return value ? clone(value) : undefined;
  }

  listItems(
    filters: {
      order?: string | undefined;
      subscription?: string | undefined;
      product?: string | undefined;
      one_time?: boolean | undefined;
      status?: number | undefined;
    } = {},
  ) {
    return clone(
      this.state.items.filter((item) => {
        const order = this.state.orders.find(
          (candidate) => candidate.public_id === item.order,
        );
        return (
          (!filters.order || item.order === filters.order) &&
          (!filters.subscription ||
            item.subscription === filters.subscription) &&
          (!filters.product || item.product === filters.product) &&
          (filters.one_time === undefined ||
            item.one_time === filters.one_time) &&
          (filters.status === undefined || order?.status === filters.status)
        );
      }),
    );
  }

  /**
   * Sources: https://developer.ordergroove.com/reference/skip-subscription and
   * https://developer.ordergroove.com/docs/data-model-at-a-glance
   * Generation details and repeated-action rejection are simulator conventions.
   */
  skipSubscription(orderId: string, subscriptionId: string) {
    const order = this.state.orders.find(
      (candidate) => candidate.public_id === orderId,
    );
    if (!order) throw new DomainError(404, "Order not found.");
    const subscription = this.state.subscriptions.find(
      (candidate) => candidate.public_id === subscriptionId,
    );
    if (!subscription) throw new DomainError(400, "Subscription not found.");
    if (order.status !== 1)
      throw new DomainError(400, "Only unsent orders can be skipped.");
    if (subscription.customer !== order.customer) {
      throw new DomainError(
        400,
        "Subscription does not belong to the order customer.",
      );
    }
    const matching = this.state.items.filter(
      (item) => item.order === orderId && item.subscription === subscriptionId,
    );
    if (matching.length === 0) {
      throw new DomainError(400, "Subscription has no items in this order.");
    }

    const generatedId = `order_generated_${this.state.nextGeneratedOrder}`;
    const generated: Order = {
      ...clone(order),
      public_id: generatedId,
      place: addRecurrence(
        order.place.slice(0, 10),
        subscription.every,
        subscription.every_period,
      ),
      created: fixedTimestamp,
      updated: fixedTimestamp,
      status: 1,
    };

    this.state.orders.push(generated);
    for (const item of matching) item.order = generatedId;
    this.state.nextGeneratedOrder += 1;
    this.assertIntegrity(this.state);
    return clone(order);
  }

  private requireSubscription(id: string) {
    const subscription = this.state.subscriptions.find(
      (candidate) => candidate.public_id === id,
    );
    if (!subscription) throw new DomainError(404, "Subscription not found.");
    return subscription;
  }

  private requireOrder(id: string) {
    const order = this.state.orders.find(
      (candidate) => candidate.public_id === id,
    );
    if (!order) throw new DomainError(404, "Order not found.");
    return order;
  }

  private requireLiveCustomerAddress(id: string, customerId: string) {
    const address = this.state.addresses.find(
      (candidate) => candidate.public_id === id,
    );
    if (!address) throw new DomainError(400, "Address not found.");
    if (!address.live) throw new DomainError(400, "Address is inactive.");
    if (address.customer !== customerId) {
      throw new DomainError(
        400,
        "Address does not belong to the resource customer.",
      );
    }
    return address;
  }

  private requireLiveCustomerPayment(id: string, customerId: string) {
    const payment = this.state.payments.find(
      (candidate) => candidate.public_id === id,
    );
    if (!payment) throw new DomainError(400, "Payment not found.");
    if (!payment.live) throw new DomainError(400, "Payment is inactive.");
    if (payment.customer !== customerId) {
      throw new DomainError(
        400,
        "Payment does not belong to the resource customer.",
      );
    }
    return payment;
  }

  private assertIntegrity(state: CommerceState) {
    const customers = new Set(
      state.customers.map((value) => value.merchant_user_id),
    );
    const products = new Set(
      state.products.map((value) => value.external_product_id),
    );
    const addresses = new Map(
      state.addresses.map((value) => [value.public_id, value.customer]),
    );
    const payments = new Map(
      state.payments.map((value) => [value.public_id, value.customer]),
    );
    const subscriptions = new Set(
      state.subscriptions.map((value) => value.public_id),
    );
    const orders = new Set(state.orders.map((value) => value.public_id));

    for (const address of state.addresses) {
      if (!customers.has(address.customer)) {
        throw new Error(`Invalid address: ${address.public_id}`);
      }
    }
    for (const payment of state.payments) {
      if (!customers.has(payment.customer)) {
        throw new Error(`Invalid payment: ${payment.public_id}`);
      }
    }

    for (const subscription of state.subscriptions) {
      if (
        !customers.has(subscription.customer) ||
        !products.has(subscription.product) ||
        (subscription.shipping_address !== undefined &&
          subscription.shipping_address !== null &&
          addresses.get(subscription.shipping_address) !==
            subscription.customer) ||
        (subscription.payment !== undefined &&
          subscription.payment !== null &&
          payments.get(subscription.payment) !== subscription.customer)
      ) {
        throw new Error(
          `Invalid subscription relationship: ${subscription.public_id}`,
        );
      }
    }
    for (const order of state.orders) {
      if (
        !customers.has(order.customer) ||
        (order.shipping_address !== undefined &&
          order.shipping_address !== null &&
          addresses.get(order.shipping_address) !== order.customer) ||
        (order.payment !== undefined &&
          order.payment !== null &&
          payments.get(order.payment) !== order.customer)
      )
        throw new Error(`Invalid order: ${order.public_id}`);
    }
    for (const item of state.items) {
      if (
        !orders.has(item.order) ||
        !products.has(item.product) ||
        (item.subscription !== null &&
          item.subscription !== undefined &&
          !subscriptions.has(item.subscription))
      ) {
        throw new Error(`Invalid item relationship: ${item.public_id}`);
      }
    }
  }
}
