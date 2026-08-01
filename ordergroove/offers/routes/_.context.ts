import { Store } from "../../_.store.js";
import type { Context$ } from "../types/_.context.js";
import type { Entitlement } from "../types/components/schemas/Entitlement.js";
import type { OfferProfile } from "../types/components/schemas/OfferProfile.js";
import type { OneTimeDiscount } from "../types/components/schemas/OneTimeDiscount.js";

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

  seedOfferProfiles(profiles: OfferProfile[]): void {
    this.store.seedOfferProfiles(profiles);
  }

  listOfferProfiles(): OfferProfile[] {
    return this.store.listOfferProfiles();
  }

  seedOneTimeDiscounts(discounts: OneTimeDiscount[]): void {
    this.store.seedOneTimeDiscounts(discounts);
  }

  listOneTimeDiscounts(): OneTimeDiscount[] {
    return this.store.listOneTimeDiscounts();
  }

  createOneTimeDiscount(input: OneTimeDiscount): OneTimeDiscount {
    return this.store.createOneTimeDiscount(input);
  }

  seedEntitlements(entitlements: Entitlement[]): void {
    this.store.seedEntitlements(entitlements);
  }

  listEntitlements(customerId?: string): Entitlement[] {
    return this.store.listEntitlements(customerId);
  }
}
