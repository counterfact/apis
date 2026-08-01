import type { Customer } from "./customers/types/components/schemas/Customer.js";
import type { Item } from "./items/types/components/schemas/Item.js";
import type { Entitlement } from "./offers/types/components/schemas/Entitlement.js";
import type { OfferProfile } from "./offers/types/components/schemas/OfferProfile.js";
import type { OneTimeDiscount } from "./offers/types/components/schemas/OneTimeDiscount.js";
import type { Order } from "./orders/types/components/schemas/Order.js";
import type { Product } from "./products/types/components/schemas/Product.js";
import type { Subscription } from "./subscriptions/types/components/schemas/Subscription.js";

export type ItemFilters = {
  subscription?: string;
  order?: string;
};

export type OrderFilters = {
  customer?: string;
  status?: number | string;
};

export type SubscriptionFilters = {
  customer?: string;
  product?: string;
  live?: boolean | "true" | "false";
  created_start?: string;
  created_end?: string;
};

export type SeedSubscription = {
  subscription: Subscription;
  createdAt: string;
};

export class Store {
  apiKey = "ordergroove-local-api-key";
  customers = new Map<string, Customer>();
  nextCustomerNumber = 1;
  items = new Map<string, Item>();
  nextItemNumber = 1;
  offerProfiles = new Map<string, OfferProfile>();
  oneTimeDiscounts = new Map<string, OneTimeDiscount>();
  entitlements = new Map<string, Entitlement>();
  nextDiscountNumber = 1;
  orders = new Map<string, Order>();
  nextOrderNumber = 1;
  products = new Map<string, Product>();
  subscriptions = new Map<string, Subscription>();
  subscriptionCreatedDates = new Map<string, string>();

  isAuthorized(apiKey: string | undefined): boolean {
    return apiKey === this.apiKey;
  }

  seedCustomers(customers: Customer[]): void {
    this.customers.clear();
    for (const customer of customers) {
      if (customer.public_id) {
        this.customers.set(customer.public_id, structuredClone(customer));
      }
    }
    this.nextCustomerNumber = this.findNextCustomerNumber();
  }

  listCustomers(): Customer[] {
    return [...this.customers.values()].map((customer) =>
      structuredClone(customer),
    );
  }

  getCustomer(publicId: string): Customer | undefined {
    const customer = this.customers.get(publicId);
    return customer ? structuredClone(customer) : undefined;
  }

  createCustomer(input: Customer): Customer {
    const customerNumber = this.nextAvailableCustomerNumber();
    const suffix = String(customerNumber).padStart(3, "0");
    const publicId = input.public_id ?? `customer-${suffix}`;
    const customer = {
      ...structuredClone(input),
      id: input.id ?? `customer-internal-${suffix}`,
      public_id: publicId,
    };
    this.customers.set(publicId, customer);
    return structuredClone(customer);
  }

  replaceCustomer(publicId: string, input: Customer): Customer | undefined {
    const existing = this.customers.get(publicId);
    if (!existing) return undefined;
    const customer = {
      ...structuredClone(input),
      id: existing.id,
      public_id: publicId,
    };
    this.customers.set(publicId, customer);
    return structuredClone(customer);
  }

  findNextCustomerNumber(): number {
    let next = 1;
    while (this.customers.has(`customer-${String(next).padStart(3, "0")}`)) {
      next += 1;
    }
    return next;
  }

  nextAvailableCustomerNumber(): number {
    const current = this.nextCustomerNumber;
    this.nextCustomerNumber += 1;
    while (
      this.customers.has(
        `customer-${String(this.nextCustomerNumber).padStart(3, "0")}`,
      )
    ) {
      this.nextCustomerNumber += 1;
    }
    return current;
  }

  seedItems(items: Item[]): void {
    this.items.clear();
    for (const item of items) {
      if (item.public_id) this.items.set(item.public_id, structuredClone(item));
    }
    this.nextItemNumber = this.findNextItemNumber();
  }

  listItems(filters: ItemFilters): Item[] {
    return [...this.items.values()]
      .filter(
        (item) =>
          (!filters.subscription ||
            item.subscription_id === filters.subscription) &&
          (!filters.order || item.order_id === filters.order),
      )
      .map((item) => structuredClone(item));
  }

  getItem(publicId: string): Item | undefined {
    const item = this.items.get(publicId);
    return item ? structuredClone(item) : undefined;
  }

  createItem(input: Item): Item {
    const itemNumber = this.nextAvailableItemNumber();
    const suffix = String(itemNumber).padStart(3, "0");
    const publicId = input.public_id ?? `item-${suffix}`;
    const item = {
      ...structuredClone(input),
      id: input.id ?? `item-internal-${suffix}`,
      public_id: publicId,
    };
    this.items.set(publicId, item);
    return structuredClone(item);
  }

  deleteItem(publicId: string): boolean {
    return this.items.delete(publicId);
  }

  findNextItemNumber(): number {
    let next = 1;
    while (this.items.has(`item-${String(next).padStart(3, "0")}`)) next += 1;
    return next;
  }

  nextAvailableItemNumber(): number {
    const current = this.nextItemNumber;
    this.nextItemNumber += 1;
    while (
      this.items.has(`item-${String(this.nextItemNumber).padStart(3, "0")}`)
    ) {
      this.nextItemNumber += 1;
    }
    return current;
  }

  seedOfferProfiles(offerProfiles: OfferProfile[]): void {
    this.offerProfiles.clear();
    for (const profile of offerProfiles) {
      if (profile.id)
        this.offerProfiles.set(profile.id, structuredClone(profile));
    }
  }

  listOfferProfiles(): OfferProfile[] {
    return [...this.offerProfiles.values()].map((profile) =>
      structuredClone(profile),
    );
  }

  seedOneTimeDiscounts(discounts: OneTimeDiscount[]): void {
    this.oneTimeDiscounts.clear();
    for (const discount of discounts) {
      if (discount.id) {
        this.oneTimeDiscounts.set(discount.id, structuredClone(discount));
      }
    }
    this.nextDiscountNumber = this.findNextDiscountNumber();
  }

  listOneTimeDiscounts(): OneTimeDiscount[] {
    return [...this.oneTimeDiscounts.values()].map((discount) =>
      structuredClone(discount),
    );
  }

  createOneTimeDiscount(input: OneTimeDiscount): OneTimeDiscount {
    const id = input.id ?? this.nextDiscountId();
    const discount = { ...structuredClone(input), id };
    this.oneTimeDiscounts.set(id, discount);
    return structuredClone(discount);
  }

  seedEntitlements(entitlements: Entitlement[]): void {
    this.entitlements.clear();
    for (const entitlement of entitlements) {
      if (entitlement.id) {
        this.entitlements.set(entitlement.id, structuredClone(entitlement));
      }
    }
  }

  listEntitlements(customerId?: string): Entitlement[] {
    return [...this.entitlements.values()]
      .filter(
        (entitlement) =>
          customerId === undefined || entitlement.customer_id === customerId,
      )
      .map((entitlement) => structuredClone(entitlement));
  }

  findNextDiscountNumber(): number {
    let next = 1;
    while (
      this.oneTimeDiscounts.has(`discount-${String(next).padStart(3, "0")}`)
    ) {
      next += 1;
    }
    return next;
  }

  nextDiscountId(): string {
    const id = `discount-${String(this.nextDiscountNumber).padStart(3, "0")}`;
    this.nextDiscountNumber += 1;
    while (
      this.oneTimeDiscounts.has(
        `discount-${String(this.nextDiscountNumber).padStart(3, "0")}`,
      )
    ) {
      this.nextDiscountNumber += 1;
    }
    return id;
  }

  seedOrders(orders: Order[]): void {
    this.orders.clear();
    for (const order of orders) {
      if (order.public_id)
        this.orders.set(order.public_id, structuredClone(order));
    }
    this.nextOrderNumber = this.findNextOrderNumber();
  }

  listOrders(filters: OrderFilters): Order[] {
    const status =
      typeof filters.status === "string"
        ? Number(filters.status)
        : filters.status;
    return [...this.orders.values()]
      .filter(
        (order) =>
          (!filters.customer || order.customer_id === filters.customer) &&
          (status === undefined || order.status === status),
      )
      .map((order) => structuredClone(order));
  }

  getOrder(publicId: string): Order | undefined {
    const order = this.orders.get(publicId);
    return order ? structuredClone(order) : undefined;
  }

  cancelOrder(publicId: string): Order | undefined {
    // https://developer.ordergroove.com/reference/orders-cancel
    // A cancelled subscription-backed order gets a subsequent order based on
    // the subscription frequency.
    // https://developer.ordergroove.com/reference/order-status-codes
    // 4 is the documented CANCELLED status.
    const existing = this.orders.get(publicId);
    if (!existing) return undefined;
    const cancelled = this.updateOrder(publicId, { status: 4 });
    this.createSubsequentOrders(existing, existing.place);
    return cancelled;
  }

  sendOrderNow(
    publicId: string,
    placedAt = new Date().toISOString(),
  ): Order | undefined {
    // https://developer.ordergroove.com/reference/orders-send-now
    // https://developer.ordergroove.com/reference/order-status-codes
    // Send Now moves placement into a 24-hour window and uses status 6
    // (SEND_NOW), whose documented state already has a future order created.
    const existing = this.orders.get(publicId);
    if (!existing) return undefined;
    const sent = this.updateOrder(publicId, { place: placedAt, status: 6 });
    this.createSubsequentOrders(existing, placedAt);
    return sent;
  }

  updateOrder(
    publicId: string,
    changes: Pick<Order, "place" | "status">,
  ): Order | undefined {
    const existing = this.orders.get(publicId);
    if (!existing) return undefined;
    const order = { ...existing, ...changes };
    this.orders.set(publicId, order);
    return structuredClone(order);
  }

  findNextOrderNumber(): number {
    let next = 1;
    while (this.orders.has(`order-${String(next).padStart(3, "0")}`)) next += 1;
    return next;
  }

  nextAvailableOrderNumber(): number {
    const current = this.nextOrderNumber;
    this.nextOrderNumber += 1;
    while (
      this.orders.has(`order-${String(this.nextOrderNumber).padStart(3, "0")}`)
    ) {
      this.nextOrderNumber += 1;
    }
    return current;
  }

  createSubsequentOrders(sourceOrder: Order, basePlace?: string): void {
    if (!sourceOrder.public_id || !basePlace) return;

    const sourceItems = [...this.items.values()].filter(
      (item) => item.order_id === sourceOrder.public_id && item.subscription_id,
    );
    const subscriptionIds = new Set(
      sourceItems.map((item) => item.subscription_id as string),
    );

    for (const subscriptionId of subscriptionIds) {
      const subscription = this.subscriptions.get(subscriptionId);
      if (
        !subscription?.live ||
        subscription.every === undefined ||
        subscription.every_period === undefined
      ) {
        continue;
      }

      // https://developer.ordergroove.com/docs/data-model-at-a-glance
      // A subscription has one upcoming order; the subsequent placement date is
      // the previous order date plus the subscription frequency. The local
      // OpenAPI string cadence is authoritative over the documented numeric one.
      const place = this.addFrequency(
        basePlace,
        subscription.every,
        subscription.every_period,
      );
      if (!place) continue;

      const orderNumber = this.nextAvailableOrderNumber();
      const suffix = String(orderNumber).padStart(3, "0");
      const publicId = `order-${suffix}`;
      this.orders.set(publicId, {
        ...structuredClone(sourceOrder),
        id: `order-internal-${suffix}`,
        public_id: publicId,
        place,
        status: 1,
        order_merchant_id: undefined,
      });

      for (const sourceItem of sourceItems.filter(
        (item) => item.subscription_id === subscriptionId,
      )) {
        this.createItem({
          ...structuredClone(sourceItem),
          id: undefined,
          public_id: undefined,
          order_id: publicId,
        });
      }
    }
  }

  addFrequency(
    basePlace: string,
    every: number,
    period: string,
  ): string | undefined {
    const date = new Date(basePlace);
    if (Number.isNaN(date.valueOf())) return undefined;

    switch (period) {
      case "day":
        date.setUTCDate(date.getUTCDate() + every);
        break;
      case "week":
        date.setUTCDate(date.getUTCDate() + every * 7);
        break;
      case "month":
        date.setUTCMonth(date.getUTCMonth() + every);
        break;
      case "year":
        date.setUTCFullYear(date.getUTCFullYear() + every);
        break;
      default:
        return undefined;
    }
    return date.toISOString();
  }

  seedProducts(products: Product[]): void {
    this.products.clear();
    for (const product of products) {
      if (product.id) this.products.set(product.id, structuredClone(product));
    }
  }

  listProducts(): Product[] {
    return [...this.products.values()].map((product) =>
      structuredClone(product),
    );
  }

  getProduct(id: string): Product | undefined {
    const product = this.products.get(id);
    return product ? structuredClone(product) : undefined;
  }

  replaceProduct(id: string, input: Product): Product | undefined {
    if (!this.products.has(id)) return undefined;
    const product = { ...structuredClone(input), id };
    this.products.set(id, product);
    return structuredClone(product);
  }

  seedSubscriptions(entries: SeedSubscription[]): void {
    this.subscriptions.clear();
    this.subscriptionCreatedDates.clear();
    for (const { subscription, createdAt } of entries) {
      if (!subscription.public_id) continue;
      this.subscriptions.set(
        subscription.public_id,
        structuredClone(subscription),
      );
      this.subscriptionCreatedDates.set(subscription.public_id, createdAt);
    }
  }

  listSubscriptions(filters: SubscriptionFilters): Subscription[] {
    const live =
      filters.live === "true"
        ? true
        : filters.live === "false"
          ? false
          : filters.live;
    return [...this.subscriptions.entries()]
      .filter(([publicId, subscription]) => {
        const createdAt = this.subscriptionCreatedDates.get(publicId);
        return (
          (!filters.customer ||
            subscription.customer_id === filters.customer) &&
          (!filters.product || subscription.product_id === filters.product) &&
          (live === undefined || subscription.live === live) &&
          (!filters.created_start ||
            (createdAt !== undefined && createdAt >= filters.created_start)) &&
          (!filters.created_end ||
            (createdAt !== undefined && createdAt <= filters.created_end))
        );
      })
      .map(([, subscription]) => structuredClone(subscription));
  }

  getSubscription(publicId: string): Subscription | undefined {
    const subscription = this.subscriptions.get(publicId);
    return subscription ? structuredClone(subscription) : undefined;
  }

  replaceSubscription(
    publicId: string,
    input: Subscription,
  ): Subscription | undefined {
    const existing = this.subscriptions.get(publicId);
    if (!existing) return undefined;
    const subscription = {
      ...structuredClone(input),
      id: existing.id,
      public_id: publicId,
    };
    this.subscriptions.set(publicId, subscription);
    return structuredClone(subscription);
  }

  cancelSubscription(publicId: string): Subscription | undefined {
    // https://developer.ordergroove.com/reference/subscriptions-cancel
    // Cancellation makes the subscription inactive and cancels subsequent
    // shipments. Ordergroove's data-pipeline guide clarifies that future,
    // unprocessed Order and Item records are removed rather than tombstoned:
    // https://developer.ordergroove.com/docs/implement-custom-data-pipelines
    const subscription = this.setSubscriptionLive(publicId, false);
    if (!subscription) return undefined;

    const futureOrderIds = new Set(
      [...this.items.values()]
        .filter((item) => item.subscription_id === publicId)
        .map((item) => item.order_id)
        .filter((orderId): orderId is string => orderId !== undefined),
    );
    for (const orderId of futureOrderIds) {
      const order = this.orders.get(orderId);
      if (order?.status !== 1) continue;
      this.orders.delete(orderId);
      for (const [itemId, item] of this.items) {
        if (item.order_id === orderId) this.items.delete(itemId);
      }
    }

    return subscription;
  }

  reactivateSubscription(publicId: string): Subscription | undefined {
    // https://developer.ordergroove.com/reference/subscriptions-reactivate
    // Reactivation changes a cancelled/inactive subscription back to live/active.
    return this.setSubscriptionLive(publicId, true);
  }

  changeSubscriptionFrequency(
    publicId: string,
    frequency: Pick<Subscription, "every" | "every_period">,
  ): Subscription | undefined {
    const existing = this.subscriptions.get(publicId);
    if (!existing) return undefined;
    const subscription = { ...existing, ...structuredClone(frequency) };
    this.subscriptions.set(publicId, subscription);
    return structuredClone(subscription);
  }

  setSubscriptionLive(
    publicId: string,
    live: boolean,
  ): Subscription | undefined {
    const existing = this.subscriptions.get(publicId);
    if (!existing) return undefined;
    const subscription = { ...existing, live };
    this.subscriptions.set(publicId, subscription);
    return structuredClone(subscription);
  }
}
