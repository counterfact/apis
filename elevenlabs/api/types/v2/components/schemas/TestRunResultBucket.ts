import type { TestRunStatus } from "./TestRunStatus.js";
export type TestRunResultBucket = {
  test_run_ids: Array<string>;
  /**
   * Short one-line title for this bucket
   */
  title: string;
  /**
   * Short summary of why the test runs in this bucket passed or failed
   */
  reason: string;
  status: TestRunStatus;
};
