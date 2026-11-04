export type DiscountResponseModel = {
  /**
   * The discount applied to the invoice. E.g. [20.0f] for 20% off.
   */
  discount_percent_off?: number | null;
  /**
   * The discount applied to the invoice. E.g. [20.0f] for 20 cents off.
   */
  discount_amount_off?: number | null;
};
