/**
 * @example {"amount_usd":11}
 */
export type QuoteInfo = {
  /**
   * The quoted price for this item in USD. Use the order's total_amount_usd for the combined order total.
   */
  amount_usd: number;
};
