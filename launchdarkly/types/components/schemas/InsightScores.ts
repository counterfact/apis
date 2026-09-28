import type { InsightPeriod } from "./InsightPeriod.js";
import type { InsightGroupScores } from "./InsightGroupScores.js";

export type InsightScores = {
  /**
   * The time period for the scores
   */
  period: InsightPeriod;
  /**
   * The time period for the scores in the last period
   */
  lastPeriod: InsightPeriod;
  /**
   * The scores for the insight groups
   */
  scores: InsightGroupScores;
  /**
   * The location and content type of related resources
   */
  _links?: { [key: string]: unknown };
};
