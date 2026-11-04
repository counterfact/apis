import type { Subscription } from "./Subscription.js";

export type SubscriptionList = {
  results?: Array<Subscription>;
  next?: string;
  previous?: string;
};
