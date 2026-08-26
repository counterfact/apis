import type { IterationStatus } from "./IterationStatus.js";
import type { UnixMillis } from "./UnixMillis.js";

export type FlagEventExperimentIteration = {
  /**
   * The experiment iteration ID
   * @example "65baa44ecc4b5bce113bb4f7"
   */
  id: string;
  /**
   * The experiment iteration status
   * @example "running"
   */
  status: IterationStatus;
  /**
   * Timestamp of when the iteration started
   * @example "1655314200000"
   */
  startedAt: UnixMillis;
  /**
   * Timestamp of when the iteration ended
   * @example "1656610200000"
   */
  endedAt?: UnixMillis;
  /**
   * The location and content type of related resources
   */
  _links?: { [key: string]: unknown };
};
