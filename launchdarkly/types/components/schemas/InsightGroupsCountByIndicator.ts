export type InsightGroupsCountByIndicator = {
  /**
   * The number of insight groups with an excellent indicator
   * @example 1
   */
  excellent: number;
  /**
   * The number of insight groups with a good indicator
   * @example 1
   */
  good: number;
  /**
   * The number of insight groups with a fair indicator
   * @example 1
   */
  fair: number;
  /**
   * The number of insight groups with a needs attention indicator
   * @example 1
   */
  needsAttention: number;
  /**
   * The number of insight groups with a not calculated indicator
   * @example 1
   */
  notCalculated: number;
  /**
   * The number of insight groups with an unknown indicator
   * @example 1
   */
  unknown: number;
  /**
   * The total number of insight groups
   * @example 6
   */
  total: number;
};
