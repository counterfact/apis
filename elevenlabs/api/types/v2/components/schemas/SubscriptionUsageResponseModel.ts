/**
 * @example {"actual_reported_credits":1000,"manually_gifted_credits_quota":1000,"manually_gifted_credits_used":1000,"paid_usage_based_credits_used":1000,"rollover_credits_quota":1000,"rollover_credits_used":1000,"subscription_cycle_credits_quota":1000,"subscription_cycle_credits_used":1000}
 */
export type SubscriptionUsageResponseModel = {
  /**
   * The rollover credits quota.
   */
  rollover_credits_quota: number;
  /**
   * The subscription cycle credits quota.
   */
  subscription_cycle_credits_quota: number;
  /**
   * The manually gifted credits quota.
   */
  manually_gifted_credits_quota: number;
  /**
   * The payg credits quota.
   */
  payg_credits_quota?: number | null;
  /**
   * The rollover credits used.
   */
  rollover_credits_used: number;
  /**
   * The subscription cycle credits used.
   */
  subscription_cycle_credits_used: number;
  /**
   * The manually gifted credits used.
   */
  manually_gifted_credits_used: number;
  /**
   * The payg credits used.
   */
  payg_credits_used?: number | null;
  /**
   * The paid usage based credits used.
   */
  paid_usage_based_credits_used: number;
  /**
   * The actual reported credits.
   */
  actual_reported_credits: number;
};
