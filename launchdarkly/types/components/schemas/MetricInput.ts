export type MetricInput = {
  /**
   * The metric key
   * @example "metric-key-123abc"
   */
  key: string;
  /**
   * Whether this is a metric group (true) or a metric (false). Defaults to false
   * @example true
   */
  isGroup?: boolean;
  /**
   * Deprecated, use <code>primarySingleMetricKey</code> and <code>primaryFunnelKey</code>. Whether this is a primary metric (true) or a secondary metric (false)
   * @example true
   * @deprecated
   */
  primary?: boolean;
};
