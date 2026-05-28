/**
 * Information on a single scan performed by secret scanning on the repository
 */
export type secret_scanning_scan = {
  /**
   * The type of scan
   */
  type?: string;
  /**
   * The state of the scan. Either "completed", "running", "pending", "failed", or "unknown".
   *
   * "failed": this scan type has hit its retry limit and has been marked permanently failed.
   * This usually resolves on its own at the next scheduled scan attempt. If "failed" persists, contact Support.
   *
   * "unknown": the scan is in an unrecognized or currently unhandled state.
   */
  status?: string;
  /**
   * The time that the scan was completed. Empty if the scan is running
   * @format date-time
   */
  completed_at?: string;
  /**
   * The time that the scan was started. Empty if the scan is pending
   * @format date-time
   */
  started_at?: string;
};
