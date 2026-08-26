export type PullRequestLeadTimeRep = {
  /**
   * The coding duration in milliseconds
   * @format int64
   * @example 1000000
   */
  codingDurationMs: number;
  /**
   * The review duration in milliseconds
   * @format int64
   * @example 500000
   */
  reviewDurationMs?: number;
  /**
   * The max wait duration between merge time and deploy start time in milliseconds
   * @format int64
   * @example 100000
   */
  maxWaitDurationMs?: number;
  /**
   * The average wait duration between merge time and deploy start time in milliseconds
   * @format int64
   * @example 100000
   */
  avgWaitDurationMs?: number;
  /**
   * The max deploy duration in milliseconds
   * @format int64
   * @example 100000
   */
  maxDeployDurationMs?: number;
  /**
   * The average deploy duration in milliseconds
   * @format int64
   * @example 100000
   */
  avgDeployDurationMs?: number;
  /**
   * The max total lead time in milliseconds
   * @format int64
   * @example 1600000
   */
  maxTotalLeadTimeMs?: number;
  /**
   * The average total lead time in milliseconds
   * @format int64
   * @example 1600000
   */
  avgTotalLeadTimeMs?: number;
};
