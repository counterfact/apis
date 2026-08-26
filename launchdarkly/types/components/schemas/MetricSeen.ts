export type MetricSeen = {
  /**
   * Whether the metric has received an event for this iteration
   * @example true
   */
  ever?: boolean;
  /**
   * Timestamp of when the metric most recently received an event for this iteration
   * @format int64
   * @example 1657129307
   */
  timestamp?: number;
};
