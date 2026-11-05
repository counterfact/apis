/**
 * Cumulative LLM cost of running post-call analysis on this conversation.
 */
export type AnalysisRunningTotal = {
  /**
   * @default 0
   */
  price?: number;
  /**
   * @default 0
   */
  charge?: number;
  /**
   * @default 0
   */
  runs?: number;
  price_per_feature?: { [key: string]: number };
  charge_per_feature?: { [key: string]: number };
};
