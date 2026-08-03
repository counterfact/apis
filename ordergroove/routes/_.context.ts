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
}
