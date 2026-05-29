import type { marketplace_account } from "./marketplace-account.js";
import type { marketplace_listing_plan } from "./marketplace-listing-plan.js";

/**
 * User Marketplace Purchase
 */
export type user_marketplace_purchase = {
  /**
   * @example "monthly"
   */
  billing_cycle: string;
  /**
   * @format date-time
   * @example "2017-11-11T00:00:00Z"
   */
  next_billing_date: string;
  unit_count: number;
  /**
   * @example true
   */
  on_free_trial: boolean;
  /**
   * @format date-time
   * @example "2017-11-11T00:00:00Z"
   */
  free_trial_ends_on: string;
  /**
   * @format date-time
   * @example "2017-11-02T01:12:12Z"
   */
  updated_at: string;
  account: marketplace_account;
  plan: marketplace_listing_plan;
};
