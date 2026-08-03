import type { Subscription } from "./Subscription.js";

export type SubscriptionPage = {
  /**
   * @format uri
   */
  next: string | null;
  /**
   * @format uri
   */
  previous: string | null;
  results: Array<Subscription>;
};
