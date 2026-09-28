import type { Context$ } from "../types/_.context.js";
import type { Item } from "../types/components/schemas/Item.js";

export type ItemFilters = {
  subscription?: string;
  order?: string;
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

  readonly #items = new Map<string, Item>();
  #nextItemNumber = 1;

  constructor($: Context$) {
    void $;
  }

  isAuthorized(apiKey: string | undefined): boolean {
    return apiKey === this.apiKey;
  }

  seedItems(items: Item[]): void {
    this.#items.clear();

    for (const item of items) {
      if (item.public_id) {
        this.#items.set(item.public_id, structuredClone(item));
      }
    }

    this.#nextItemNumber = this.#findNextItemNumber();
  }

  listItems(filters: ItemFilters): Item[] {
    return [...this.#items.values()]
      .filter(
        (item) =>
          (!filters.subscription ||
            item.subscription_id === filters.subscription) &&
          (!filters.order || item.order_id === filters.order),
      )
      .map((item) => structuredClone(item));
  }

  getItem(publicId: string): Item | undefined {
    const item = this.#items.get(publicId);
    return item ? structuredClone(item) : undefined;
  }

  createItem(input: Item): Item {
    const itemNumber = this.#nextAvailableItemNumber();
    const suffix = String(itemNumber).padStart(3, "0");
    const publicId = input.public_id ?? `item-${suffix}`;
    const item = {
      ...structuredClone(input),
      id: input.id ?? `item-internal-${suffix}`,
      public_id: publicId,
    };

    this.#items.set(publicId, item);
    return structuredClone(item);
  }

  deleteItem(publicId: string): boolean {
    return this.#items.delete(publicId);
  }

  #findNextItemNumber(): number {
    let next = 1;
    while (this.#items.has(`item-${String(next).padStart(3, "0")}`)) {
      next += 1;
    }
    return next;
  }

  #nextAvailableItemNumber(): number {
    const current = this.#nextItemNumber;
    this.#nextItemNumber += 1;
    while (
      this.#items.has(`item-${String(this.#nextItemNumber).padStart(3, "0")}`)
    ) {
      this.#nextItemNumber += 1;
    }
    return current;
  }
}
