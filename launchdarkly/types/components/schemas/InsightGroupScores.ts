import type { InsightsMetricScore } from "./InsightsMetricScore.js";

export type InsightGroupScores = {
  /**
   * The overall score for the insight group
   */
  overall: InsightsMetricScore;
  /**
   * The deployment frequency score for the insight group
   */
  deploymentFrequency: InsightsMetricScore;
  /**
   * The deployment failure rate score for the insight group
   */
  deploymentFailureRate: InsightsMetricScore;
  /**
   * The lead time score for the insight group
   */
  leadTime: InsightsMetricScore;
  /**
   * The impact size score for the insight group
   */
  impactSize: InsightsMetricScore;
  /**
   * The Experimentation coverage score for the insight group
   */
  experimentationCoverage: InsightsMetricScore;
  /**
   * The flag health score for the insight group
   */
  flagHealth: InsightsMetricScore;
  /**
   * The velocity score for the insight group
   */
  velocity: InsightsMetricScore;
  /**
   * The risk score for the insight group
   */
  risk: InsightsMetricScore;
  /**
   * The efficiency score for the insight group
   */
  efficiency: InsightsMetricScore;
  /**
   * The creation ratio score for the insight group
   */
  creationRatio?: InsightsMetricScore;
};
