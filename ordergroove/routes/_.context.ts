import type { Context$ } from "../types/_.context.js";
import type { Address } from "../types/components/schemas/Address.js";
import type { Customer } from "../types/components/schemas/Customer.js";
import type { Item } from "../types/components/schemas/Item.js";
import type { Order } from "../types/components/schemas/Order.js";
import type { Payment } from "../types/components/schemas/Payment.js";
import type { Product } from "../types/components/schemas/Product.js";
import type { Subscription } from "../types/components/schemas/Subscription.js";

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

export interface State {
  customers: Customer[];
  addresses: Address[];
  payments: Payment[];
  products: Product[];
  subscriptions: Subscription[];
  orders: Order[];
  items: Item[];
}

interface PaginationRequest {
  headers: Record<string, unknown>;
  path: string;
  query: Record<string, unknown>;
}

export const emptyState = (): State => ({
  customers: [],
  addresses: [],
  payments: [],
  products: [],
  subscriptions: [],
  orders: [],
  items: [],
});

export class Context {
  state: State;

  constructor($: Context$) {
    void $;
    this.state = emptyState();
  }

  reset(state: State = emptyState()): State {
    this.state = structuredClone(state);
    return this.state;
  }

  isAuthorized(apiKey: string | undefined): boolean {
    return apiKey === "ordergroove-simulator-key";
  }

  nextOrderPlace(place: string, subscription: Subscription): string {
    const [year, month, day] = place.split("-").map(Number);
    const date = new Date(Date.UTC(year, month - 1, day));

    switch (subscription.every_period) {
      case 1:
        date.setUTCDate(date.getUTCDate() + subscription.every);
        break;
      case 2:
        date.setUTCDate(date.getUTCDate() + subscription.every * 7);
        break;
      case 3:
        return this.addMonthsClamped(year, month, day, subscription.every);
      case 4:
        return this.addMonthsClamped(year, month, day, subscription.every * 12);
    }

    return date.toISOString().slice(0, 10);
  }

  paginate<Item>(
    items: Item[],
    request: PaginationRequest,
  ): {
    next: string | null;
    previous: string | null;
    results: Item[];
  } {
    const size = this.pageSize(request.query.page_size);
    const offset = Math.min(
      this.cursorOffset(request.query.cursor),
      items.length,
    );
    const host = String(request.headers.host ?? "localhost:3100");

    const link = (linkOffset: number): string => {
      const params = new URLSearchParams();
      for (const [name, value] of Object.entries(request.query)) {
        if (name !== "cursor" && value !== undefined) {
          for (const entry of Array.isArray(value) ? value : [value]) {
            params.append(name, String(entry));
          }
        }
      }
      params.set("cursor", `offset:${linkOffset}`);
      return `http://${host}${request.path}?${params.toString()}`;
    };

    return {
      next: offset + size < items.length ? link(offset + size) : null,
      previous: offset > 0 ? link(Math.max(0, offset - size)) : null,
      results: items.slice(offset, offset + size),
    };
  }

  private cursorOffset(cursor: unknown): number {
    if (typeof cursor !== "string") return 0;
    const match = /^offset:(\d+)$/.exec(cursor);
    return match ? Number(match[1]) : 0;
  }

  private pageSize(value: unknown): number {
    const parsed = typeof value === "number" ? value : Number(value ?? 10);
    return Number.isInteger(parsed) && parsed >= 1 && parsed <= 100
      ? parsed
      : 10;
  }

  private addMonthsClamped(
    year: number,
    month: number,
    day: number,
    months: number,
  ): string {
    const targetMonth = month - 1 + months;
    const targetYear = year + Math.floor(targetMonth / 12);
    const normalizedMonth = ((targetMonth % 12) + 12) % 12;
    const lastDay = new Date(
      Date.UTC(targetYear, normalizedMonth + 1, 0),
    ).getUTCDate();
    return new Date(
      Date.UTC(targetYear, normalizedMonth, Math.min(day, lastDay)),
    )
      .toISOString()
      .slice(0, 10);
  }
}
