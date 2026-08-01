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
  status?: string;
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
  }

  listOrders(filters: OrderFilters): Order[] {
    return [...this.orders.values()]
      .filter(
        (order) =>
          (!filters.customer || order.customer_id === filters.customer) &&
          (!filters.status || order.status === filters.status),
      )
      .map((order) => structuredClone(order));
  }

  getOrder(publicId: string): Order | undefined {
    const order = this.orders.get(publicId);
    return order ? structuredClone(order) : undefined;
  }

  cancelOrder(publicId: string): Order | undefined {
    return this.updateOrder(publicId, { status: "cancelled" });
  }

  sendOrderNow(
    publicId: string,
    placedAt = new Date().toISOString(),
  ): Order | undefined {
    return this.updateOrder(publicId, { place: placedAt, status: "pending" });
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
    return this.setSubscriptionLive(publicId, false);
  }

  reactivateSubscription(publicId: string): Subscription | undefined {
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
