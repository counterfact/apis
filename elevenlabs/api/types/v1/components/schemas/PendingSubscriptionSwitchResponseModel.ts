import type { BillingPeriod } from "./BillingPeriod.js";
export type PendingSubscriptionSwitchResponseModel = {
  /**
   * @default "change"
   */
  kind?: "change";
  /**
   * The tier to change to.
   */
  next_tier:
    | "free"
    | "starter"
    | "go"
    | "creator"
    | "pro"
    | "growing_business"
    | "scale_2024_08_10"
    | "grant_tier_1_2025_07_23"
    | "grant_tier_2_2025_07_23"
    | "grant"
    | "trial"
    | "enterprise";
  /**
   * The billing period to change to.
   */
  next_billing_period: BillingPeriod;
  /**
   * The timestamp of the change.
   */
  timestamp_seconds: number;
};
