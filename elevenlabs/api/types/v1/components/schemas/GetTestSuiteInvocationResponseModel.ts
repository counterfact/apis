import type { BucketingStatus } from "./BucketingStatus.js";
import type { TestRunResultSummary } from "./TestRunResultSummary.js";
import type { UnitTestRunResponseModel } from "./UnitTestRunResponseModel.js";
export type GetTestSuiteInvocationResponseModel = {
  id: string;
  /**
   * The user-provided name of the test invocation, if one was set.
   */
  name?: string | null;
  agent_id?: string | null;
  branch_id?: string | null;
  version_id?: string | null;
  /**
   * @default false
   */
  ran_against_draft?: boolean;
  created_at?: number;
  folder_id?: string | null;
  /**
   * @default 1
   */
  repeat_count?: number;
  /**
   * @default false
   */
  cancelled?: boolean;
  /**
   * None when repeat_count==1 (no bucketing). Otherwise tracks bucketing lifecycle.
   */
  bucketing_status?: BucketingStatus | null;
  result_groups?: Array<TestRunResultSummary>;
  test_runs: Array<UnitTestRunResponseModel>;
};
