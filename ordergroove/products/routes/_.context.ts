import { Store } from "../../_.store.js";
import type { Context$ } from "../types/_.context.js";
import type { Product } from "../types/components/schemas/Product.js";

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

  seedProducts(products: Product[]): void {
    this.store.seedProducts(products);
  }

  listProducts(): Product[] {
    return this.store.listProducts();
  }

  getProduct(id: string): Product | undefined {
    return this.store.getProduct(id);
  }

  replaceProduct(id: string, input: Product): Product | undefined {
    return this.store.replaceProduct(id, input);
  }
}
