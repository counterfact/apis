import type { InsightsChartSeriesMetadata } from "./InsightsChartSeriesMetadata.js";
import type { InsightsChartSeriesDataPoint } from "./InsightsChartSeriesDataPoint.js";

export type InsightsChartSeries = {
  /**
   * Metadata for the series
   */
  metadata: InsightsChartSeriesMetadata;
  /**
   * Data points for the series
   */
  data: Array<InsightsChartSeriesDataPoint>;
};
