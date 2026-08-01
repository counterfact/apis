import { Store } from "../../_.store.js";
import type { Context$ } from "../types/_.context.js";
import type { Subscription } from "../types/components/schemas/Subscription.js";

export type { SeedSubscription, SubscriptionFilters } from "../../_.store.js";
import type { SeedSubscription, SubscriptionFilters } from "../../_.store.js";

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

  seedSubscriptions(entries: SeedSubscription[]): void {
    this.store.seedSubscriptions(entries);
  }

  listSubscriptions(filters: SubscriptionFilters): Subscription[] {
    return this.store.listSubscriptions(filters);
  }

  getSubscription(publicId: string): Subscription | undefined {
    return this.store.getSubscription(publicId);
  }

  replaceSubscription(
    publicId: string,
    input: Subscription,
  ): Subscription | undefined {
    return this.store.replaceSubscription(publicId, input);
  }

  cancelSubscription(publicId: string): Subscription | undefined {
    return this.store.cancelSubscription(publicId);
  }

  reactivateSubscription(publicId: string): Subscription | undefined {
    return this.store.reactivateSubscription(publicId);
  }

  changeSubscriptionFrequency(
    publicId: string,
    frequency: Pick<Subscription, "every" | "every_period">,
  ): Subscription | undefined {
    return this.store.changeSubscriptionFrequency(publicId, frequency);
  }
}
