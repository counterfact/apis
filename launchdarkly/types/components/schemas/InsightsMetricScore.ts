import type { InsightsMetricScoreIndicator } from "./InsightsMetricScoreIndicator.js";
import type { InsightsMetricIndicatorRange } from "./InsightsMetricIndicatorRange.js";
import type { InsightsMetricScore } from "./InsightsMetricScore.js";

export type InsightsMetricScore = {
  /**
   * The score for the metric
   * @example 100
   */
  score: number;
  /**
   * The keys of the metrics that were aggregated to calculate this score
   * @example ["deploymentFrequency","leadTime"]
   */
  aggregateOf?: Array<string>;
  diffVsLastPeriod?: number;
  /**
   * The indicator for the score
   * @example "excellent"
   */
  indicator: InsightsMetricScoreIndicator;
  /**
   * The indicator range for the score
   */
  indicatorRange: InsightsMetricIndicatorRange;
  /**
   * The score for the metric in the last period
   */
  lastPeriod?: InsightsMetricScore;
};
