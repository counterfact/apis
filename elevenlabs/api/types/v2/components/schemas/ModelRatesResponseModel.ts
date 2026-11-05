/**
 * @example {"character_cost_multiplier":1,"cost_discount_multiplier":1}
 */
export type ModelRatesResponseModel = {
  /**
   * The cost multiplier for characters.
   */
  character_cost_multiplier: number;
  /**
   * Discount multiplier applied to cost estimates. Defaults to 1.0 (no discount).
   * @default 1
   */
  cost_discount_multiplier?: number;
};
