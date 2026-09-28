import type { UnixMillis } from "./UnixMillis.js";

export type InsightPeriod = {
  /**
   * The start time of the period
   * @example "1706701522000"
   */
  startTime: UnixMillis;
  /**
   * The end time of the period
   * @example "1706701522000"
   */
  endTime: UnixMillis;
};
