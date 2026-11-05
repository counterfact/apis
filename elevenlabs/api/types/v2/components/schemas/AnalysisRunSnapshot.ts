/**
 * LLM cost of the most recent post-call analysis pass on this conversation.
 */
export type AnalysisRunSnapshot = {
  /**
   * @default 0
   */
  price?: number;
  /**
   * @default 0
   */
  charge?: number;
  price_per_feature?: { [key: string]: number };
  charge_per_feature?: { [key: string]: number };
};
