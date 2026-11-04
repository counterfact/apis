import type { Context$ } from "../types/_.context.js";
import type { Subscription } from "../types/components/schemas/Subscription.js";

export type SubscriptionFilters = {
  customer?: string;
  product?: string;
  live?: boolean | "true" | "false";
  created_start?: string;
  created_end?: string;
};

export type SeedSubscription = {
  subscription: Subscription;
  createdAt: string;
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

  readonly #subscriptions = new Map<string, Subscription>();
  readonly #createdDates = new Map<string, string>();

  constructor($: Context$) {
    void $;
  }

  isAuthorized(apiKey: string | undefined): boolean {
    return apiKey === this.apiKey;
  }

  seedSubscriptions(entries: SeedSubscription[]): void {
    this.#subscriptions.clear();
    this.#createdDates.clear();

    for (const { subscription, createdAt } of entries) {
      if (!subscription.public_id) continue;

      this.#subscriptions.set(
        subscription.public_id,
        structuredClone(subscription),
      );
      this.#createdDates.set(subscription.public_id, createdAt);
    }
  }

  listSubscriptions(filters: SubscriptionFilters): Subscription[] {
    const live =
      filters.live === "true"
        ? true
        : filters.live === "false"
          ? false
          : filters.live;

    return [...this.#subscriptions.entries()]
      .filter(([publicId, subscription]) => {
        const createdAt = this.#createdDates.get(publicId);
        return (
          (!filters.customer ||
            subscription.customer_id === filters.customer) &&
          (!filters.product || subscription.product_id === filters.product) &&
          (live === undefined || subscription.live === live) &&
          (!filters.created_start ||
            (createdAt !== undefined && createdAt >= filters.created_start)) &&
          (!filters.created_end ||
            (createdAt !== undefined && createdAt <= filters.created_end))
        );
      })
      .map(([, subscription]) => structuredClone(subscription));
  }

  getSubscription(publicId: string): Subscription | undefined {
    const subscription = this.#subscriptions.get(publicId);
    return subscription ? structuredClone(subscription) : undefined;
  }

  replaceSubscription(
    publicId: string,
    input: Subscription,
  ): Subscription | undefined {
    const existing = this.#subscriptions.get(publicId);
    if (!existing) return undefined;

    const subscription = {
      ...structuredClone(input),
      id: existing.id,
      public_id: publicId,
    };
    this.#subscriptions.set(publicId, subscription);
    return structuredClone(subscription);
  }

  cancelSubscription(publicId: string): Subscription | undefined {
    return this.#setLive(publicId, false);
  }

  reactivateSubscription(publicId: string): Subscription | undefined {
    return this.#setLive(publicId, true);
  }

  changeSubscriptionFrequency(
    publicId: string,
    frequency: Pick<Subscription, "every" | "every_period">,
  ): Subscription | undefined {
    const existing = this.#subscriptions.get(publicId);
    if (!existing) return undefined;

    const subscription = { ...existing, ...structuredClone(frequency) };
    this.#subscriptions.set(publicId, subscription);
    return structuredClone(subscription);
  }

  #setLive(publicId: string, live: boolean): Subscription | undefined {
    const existing = this.#subscriptions.get(publicId);
    if (!existing) return undefined;

    const subscription = { ...existing, live };
    this.#subscriptions.set(publicId, subscription);
    return structuredClone(subscription);
  }
}
