import type { Context$ } from "../types/_.context.js";
import type { Product } from "../types/components/schemas/Product.js";

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

  readonly #products = new Map<string, Product>();

  constructor($: Context$) {
    void $;
  }

  isAuthorized(apiKey: string | undefined): boolean {
    return apiKey === this.apiKey;
  }

  seedProducts(products: Product[]): void {
    this.#products.clear();
    for (const product of products) {
      if (product.id) {
        this.#products.set(product.id, structuredClone(product));
      }
    }
  }

  listProducts(): Product[] {
    return [...this.#products.values()].map((product) =>
      structuredClone(product),
    );
  }

  getProduct(id: string): Product | undefined {
    const product = this.#products.get(id);
    return product ? structuredClone(product) : undefined;
  }

  replaceProduct(id: string, input: Product): Product | undefined {
    if (!this.#products.has(id)) return undefined;

    const product = { ...structuredClone(input), id };
    this.#products.set(id, product);
    return structuredClone(product);
  }
}
