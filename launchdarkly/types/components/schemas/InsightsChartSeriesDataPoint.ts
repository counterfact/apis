export type InsightsChartSeriesDataPoint = {
  /**
   * X-axis value
   * @format int64
   * @example 1617225600000
   */
  x: number;
  /**
   * Y-axis value
   * @format int64
   * @example 100
   */
  y: number;
  /**
   * Additional values for the data point
   */
  values?: { [key: string]: unknown };
};
