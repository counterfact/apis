import { Store } from "../../_.store.js";
import type { Context$ } from "../types/_.context.js";
import type { Order } from "../types/components/schemas/Order.js";

export type { OrderFilters } from "../../_.store.js";
import type { OrderFilters } from "../../_.store.js";

export class Context {
  readonly store: Store;

  constructor($: Context$) {
    this.store = $.store;
  }

  get apiKey(): string {
    return this.store.apiKey;
  }

  isAuthorized(apiKey: string | undefined): boolean {
    return this.store.isAuthorized(apiKey);
  }

  seedOrders(orders: Order[]): void {
    this.store.seedOrders(orders);
  }

  listOrders(filters: OrderFilters): Order[] {
    return this.store.listOrders(filters);
  }

  getOrder(publicId: string): Order | undefined {
    return this.store.getOrder(publicId);
  }

  cancelOrder(publicId: string): Order | undefined {
    return this.store.cancelOrder(publicId);
  }

  sendOrderNow(publicId: string, placedAt?: string): Order | undefined {
    return this.store.sendOrderNow(publicId, placedAt);
  }
}
