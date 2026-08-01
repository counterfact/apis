import { Store } from "../../_.store.js";
import type { Context$ } from "../types/_.context.js";
import type { Item } from "../types/components/schemas/Item.js";

export type { ItemFilters } from "../../_.store.js";
import type { ItemFilters } from "../../_.store.js";

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

  seedItems(items: Item[]): void {
    this.store.seedItems(items);
  }

  listItems(filters: ItemFilters): Item[] {
    return this.store.listItems(filters);
  }

  getItem(publicId: string): Item | undefined {
    return this.store.getItem(publicId);
  }

  createItem(input: Item): Item {
    return this.store.createItem(input);
  }

  deleteItem(publicId: string): boolean {
    return this.store.deleteItem(publicId);
  }
}
