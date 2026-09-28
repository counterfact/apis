import type { InsightsChartMetadata } from "./InsightsChartMetadata.js";
import type { InsightsChartSeries } from "./InsightsChartSeries.js";

export type InsightsChart = {
  /**
   * Metadata for the chart
   */
  metadata: InsightsChartMetadata;
  /**
   * Series data for the chart
   */
  series: Array<InsightsChartSeries>;
};
