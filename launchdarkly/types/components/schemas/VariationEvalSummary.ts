export type VariationEvalSummary = {
  /**
   * The variation value
   * @example "true"
   */
  value?: unknown;
  /**
   * The number of evaluations in the ten minutes before the flag event
   * @format int64
   * @example 1000
   */
  before?: number;
  /**
   * The number of evaluations in the ten minutes after the flag event
   * @format int64
   * @example 500
   */
  after?: number;
};
