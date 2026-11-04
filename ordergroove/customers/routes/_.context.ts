import type { Context$ } from "../types/_.context.js";
import type { Customer } from "../types/components/schemas/Customer.js";

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

  readonly #customers = new Map<string, Customer>();
  #nextCustomerNumber = 1;

  constructor($: Context$) {
    void $;
  }

  isAuthorized(apiKey: string | undefined): boolean {
    return apiKey === this.apiKey;
  }

  seedCustomers(customers: Customer[]): void {
    this.#customers.clear();
    for (const customer of customers) {
      if (customer.public_id) {
        this.#customers.set(customer.public_id, structuredClone(customer));
      }
    }
    this.#nextCustomerNumber = this.#findNextCustomerNumber();
  }

  listCustomers(): Customer[] {
    return [...this.#customers.values()].map((customer) =>
      structuredClone(customer),
    );
  }

  getCustomer(publicId: string): Customer | undefined {
    const customer = this.#customers.get(publicId);
    return customer ? structuredClone(customer) : undefined;
  }

  createCustomer(input: Customer): Customer {
    const customerNumber = this.#nextAvailableCustomerNumber();
    const suffix = String(customerNumber).padStart(3, "0");
    const publicId = input.public_id ?? `customer-${suffix}`;
    const customer = {
      ...structuredClone(input),
      id: input.id ?? `customer-internal-${suffix}`,
      public_id: publicId,
    };

    this.#customers.set(publicId, customer);
    return structuredClone(customer);
  }

  replaceCustomer(publicId: string, input: Customer): Customer | undefined {
    const existing = this.#customers.get(publicId);
    if (!existing) return undefined;

    const customer = {
      ...structuredClone(input),
      id: existing.id,
      public_id: publicId,
    };
    this.#customers.set(publicId, customer);
    return structuredClone(customer);
  }

  #findNextCustomerNumber(): number {
    let next = 1;
    while (this.#customers.has(`customer-${String(next).padStart(3, "0")}`)) {
      next += 1;
    }
    return next;
  }

  #nextAvailableCustomerNumber(): number {
    const current = this.#nextCustomerNumber;
    this.#nextCustomerNumber += 1;
    while (
      this.#customers.has(
        `customer-${String(this.#nextCustomerNumber).padStart(3, "0")}`,
      )
    ) {
      this.#nextCustomerNumber += 1;
    }
    return current;
  }
}
