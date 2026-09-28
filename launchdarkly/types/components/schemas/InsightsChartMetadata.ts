import type { InsightsChartMetadataCustomValues } from "./InsightsChartMetadataCustomValues.js";
import type { InsightsChartMetrics } from "./InsightsChartMetrics.js";
import type { InsightsChartSeriesMetadataAxis } from "./InsightsChartSeriesMetadataAxis.js";

export type InsightsChartMetadata = {
  /**
   * Metadata values
   */
  summary: InsightsChartMetadataCustomValues;
  /**
   * Name of the chart
   * @example "deploymentFrequency"
   */
  name?: string;
  /**
   * Metrics for the given chart data, included when expanded
   */
  metrics?: InsightsChartMetrics;
  /**
   * X-axis metadata
   * @example "timestamp"
   */
  xAxis: InsightsChartSeriesMetadataAxis;
  /**
   * Y-axis metadata
   * @example "count"
   */
  yAxis: InsightsChartSeriesMetadataAxis;
};
