export type MetricInMetricGroupInput = {
  /**
   * The metric key
   * @example "metric-key-123abc"
   */
  key: string;
  /**
   * Name of the metric when used within the associated metric group. Can be different from the original name of the metric
   * @example "Step 1"
   */
  nameInGroup: string;
};
