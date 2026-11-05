import type { ResourceAccessInfo } from "./ResourceAccessInfo.js";
export type TestInvocationSummaryResponseModel = {
  /**
   * The ID of the test invocation
   */
  id: string;
  /**
   * The user-provided name of the test invocation, if one was set.
   */
  name?: string | null;
  /**
   * The ID of the agent this test invocation belongs to
   */
  agent_id?: string | null;
  /**
   * The ID of the branch this test invocation was run on
   */
  branch_id?: string | null;
  /**
   * The ID of the agent version this test invocation ran against. For draft or config-override runs this is the version those uncommitted changes were applied on top of. None only for runs recorded before this field existed.
   */
  version_id?: string | null;
  /**
   * Whether the run included uncommitted changes (a saved draft or an ad-hoc config override) layered on top of version_id.
   * @default false
   */
  ran_against_draft?: boolean;
  /**
   * Whether the test runs in this invocation did not all execute against the same version, which happens when a subset of runs was resubmitted after the original run. When true, version_id describes the most recent resubmit rather than every run.
   * @default false
   */
  runs_diverged_from_version?: boolean;
  /**
   * Creation time of the test invocation in unix seconds
   */
  created_at_unix_secs: number;
  /**
   * Number of test runs in this invocation
   */
  test_run_count: number;
  /**
   * Number of test runs that passed
   */
  passed_count: number;
  /**
   * Number of test runs that failed
   */
  failed_count: number;
  /**
   * Number of test runs that are pending
   */
  pending_count: number;
  /**
   * Number of test runs that were cancelled
   */
  cancelled_count: number;
  /**
   * Display title of the test invocation: the user-provided name when set, otherwise the folder name, single test name, or test count.
   */
  title: string;
  /**
   * The access information of the test invocation
   */
  access_info?: ResourceAccessInfo | null;
  /**
   * Number of times each test was repeated in this invocation
   * @default 1
   */
  repeat_count?: number;
  /**
   * Whether this test invocation was cancelled
   * @default false
   */
  cancelled?: boolean;
  /**
   * Total credits billed across test runs in this invocation. None when no run has cost data.
   */
  credits_used?: number | null;
  /**
   * Total USD price across test runs in this invocation. None when no run has price data.
   */
  total_price?: number | null;
};
