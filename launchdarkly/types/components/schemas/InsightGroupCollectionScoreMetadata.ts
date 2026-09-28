import type { InsightPeriod } from "./InsightPeriod.js";

export type InsightGroupCollectionScoreMetadata = {
  /**
   * The time period for the score calculations
   */
  period: InsightPeriod;
  /**
   * The time period for the score calculations in the last period
   */
  lastPeriod: InsightPeriod;
};
