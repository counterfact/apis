export type LeadTimeStagesRep = {
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
   * The wait duration between merge time and deploy start time in milliseconds
   * @format int64
   * @example 100000
   */
  waitDurationMs?: number;
  /**
   * The deploy duration in milliseconds
   * @format int64
   * @example 100000
   */
  deployDurationMs?: number;
  /**
   * The total lead time in milliseconds
   * @format int64
   * @example 1600000
   */
  totalLeadTimeMs?: number;
};
