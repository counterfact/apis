import type { UnixMillis } from "./UnixMillis.js";

export type ExecutionOutput = {
  /**
   * The status of the execution of this workflow stage
   * @example "completed"
   */
  status: string;
  /**
   * Timestamp of when the workflow was completed.
   * @example "1718467200000"
   */
  stopDate?: UnixMillis;
};
