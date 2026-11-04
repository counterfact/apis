import type { NumericDistributionAggregate } from "./NumericDistributionAggregate.js";
export type TopicSentimentAggregate = {
  sentiment?: NumericDistributionAggregate;
  frustration?: NumericDistributionAggregate;
  /**
   * @default 0
   */
  positive_count?: number;
  /**
   * @default 0
   */
  neutral_count?: number;
  /**
   * @default 0
   */
  negative_count?: number;
};
