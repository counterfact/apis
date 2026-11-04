export type ToolUsageStatsResponseModel = {
  /**
   * The total number of calls to the tool
   * @default 0
   */
  total_calls?: number;
  avg_latency_secs: number;
};
