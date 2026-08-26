import type { InsightsChartBounds } from "./InsightsChartBounds.js";

export type InsightsChartSeriesMetadata = {
  /**
   * Name of the series
   */
  name: string;
  /**
   * Aggregate count of the series values
   * @format int64
   */
  count?: number;
  /**
   * Bounds for the series data
   */
  bounds?: Array<InsightsChartBounds>;
};
