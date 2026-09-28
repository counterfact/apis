import type { Context$ } from "../types/_.context.js";
import type { Entitlement } from "../types/components/schemas/Entitlement.js";
import type { OfferProfile } from "../types/components/schemas/OfferProfile.js";
import type { OneTimeDiscount } from "../types/components/schemas/OneTimeDiscount.js";

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

  readonly #offerProfiles = new Map<string, OfferProfile>();
  readonly #oneTimeDiscounts = new Map<string, OneTimeDiscount>();
  readonly #entitlements = new Map<string, Entitlement>();
  #nextDiscountNumber = 1;

  constructor($: Context$) {
    void $;
  }

  isAuthorized(apiKey: string | undefined): boolean {
    return apiKey === this.apiKey;
  }

  seedOfferProfiles(offerProfiles: OfferProfile[]): void {
    this.#offerProfiles.clear();
    for (const offerProfile of offerProfiles) {
      if (offerProfile.id) {
        this.#offerProfiles.set(offerProfile.id, structuredClone(offerProfile));
      }
    }
  }

  listOfferProfiles(): OfferProfile[] {
    return [...this.#offerProfiles.values()].map((offerProfile) =>
      structuredClone(offerProfile),
    );
  }

  seedOneTimeDiscounts(discounts: OneTimeDiscount[]): void {
    this.#oneTimeDiscounts.clear();
    for (const discount of discounts) {
      if (discount.id) {
        this.#oneTimeDiscounts.set(discount.id, structuredClone(discount));
      }
    }
    this.#nextDiscountNumber = this.#findNextDiscountNumber();
  }

  listOneTimeDiscounts(): OneTimeDiscount[] {
    return [...this.#oneTimeDiscounts.values()].map((discount) =>
      structuredClone(discount),
    );
  }

  createOneTimeDiscount(input: OneTimeDiscount): OneTimeDiscount {
    const id = input.id ?? this.#nextDiscountId();
    const discount = { ...structuredClone(input), id };
    this.#oneTimeDiscounts.set(id, discount);
    return structuredClone(discount);
  }

  seedEntitlements(entitlements: Entitlement[]): void {
    this.#entitlements.clear();
    for (const entitlement of entitlements) {
      if (entitlement.id) {
        this.#entitlements.set(entitlement.id, structuredClone(entitlement));
      }
    }
  }

  listEntitlements(customerId?: string): Entitlement[] {
    return [...this.#entitlements.values()]
      .filter(
        (entitlement) =>
          customerId === undefined || entitlement.customer_id === customerId,
      )
      .map((entitlement) => structuredClone(entitlement));
  }

  #findNextDiscountNumber(): number {
    let next = 1;
    while (
      this.#oneTimeDiscounts.has(`discount-${String(next).padStart(3, "0")}`)
    ) {
      next += 1;
    }
    return next;
  }

  #nextDiscountId(): string {
    const id = `discount-${String(this.#nextDiscountNumber).padStart(3, "0")}`;
    this.#nextDiscountNumber += 1;
    while (
      this.#oneTimeDiscounts.has(
        `discount-${String(this.#nextDiscountNumber).padStart(3, "0")}`,
      )
    ) {
      this.#nextDiscountNumber += 1;
    }
    return id;
  }
}
