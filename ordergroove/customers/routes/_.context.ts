import { Store } from "../../_.store.js";
import type { Context$ } from "../types/_.context.js";
import type { Customer } from "../types/components/schemas/Customer.js";

export class Context {
  readonly store: Store;

  constructor($: Context$ & { store?: Store }) {
    this.store = $.store ?? new Store();
  }

  get apiKey(): string {
    return this.store.apiKey;
  }

  isAuthorized(apiKey: string | undefined): boolean {
    return this.store.isAuthorized(apiKey);
  }

  seedCustomers(customers: Customer[]): void {
    this.store.seedCustomers(customers);
  }

  listCustomers(): Customer[] {
    return this.store.listCustomers();
  }

  getCustomer(publicId: string): Customer | undefined {
    return this.store.getCustomer(publicId);
  }

  createCustomer(input: Customer): Customer {
    return this.store.createCustomer(input);
  }

  replaceCustomer(publicId: string, input: Customer): Customer | undefined {
    return this.store.replaceCustomer(publicId, input);
  }
}
