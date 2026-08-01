import type { Context$ } from "../types/_.context.js";
import type { Order } from "../types/components/schemas/Order.js";

export type OrderFilters = {
  customer?: string;
  status?: string;
};

/**
 * This is the default context for Counterfact.
 *
 * It defines the context object in the REPL
 * and the $.context object in the code.
 *
 * Add properties and methods to suit your needs.
 *
 * See https://github.com/counterfact/api-simulator/blob/main/docs/features/state.md
 */

export class Context {
  readonly apiKey = "ordergroove-local-api-key";

  readonly #orders = new Map<string, Order>();

  constructor($: Context$) {
    void $;
  }

  isAuthorized(apiKey: string | undefined): boolean {
    return apiKey === this.apiKey;
  }

  seedOrders(orders: Order[]): void {
    this.#orders.clear();

    for (const order of orders) {
      if (order.public_id) {
        this.#orders.set(order.public_id, structuredClone(order));
      }
    }
  }

  listOrders(filters: OrderFilters): Order[] {
    return [...this.#orders.values()]
      .filter(
        (order) =>
          (!filters.customer || order.customer_id === filters.customer) &&
          (!filters.status || order.status === filters.status),
      )
      .map((order) => structuredClone(order));
  }

  getOrder(publicId: string): Order | undefined {
    const order = this.#orders.get(publicId);
    return order ? structuredClone(order) : undefined;
  }

  cancelOrder(publicId: string): Order | undefined {
    return this.#updateOrder(publicId, { status: "cancelled" });
  }

  sendOrderNow(
    publicId: string,
    placedAt = new Date().toISOString(),
  ): Order | undefined {
    return this.#updateOrder(publicId, {
      place: placedAt,
      status: "pending",
    });
  }

  #updateOrder(
    publicId: string,
    changes: Pick<Order, "place" | "status">,
  ): Order | undefined {
    const existing = this.#orders.get(publicId);
    if (!existing) return undefined;

    const order = { ...existing, ...changes };
    this.#orders.set(publicId, order);
    return structuredClone(order);
  }
}
