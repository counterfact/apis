import type { pull_request_minimal } from "./pull-request-minimal.js";
import type { nullable_integration } from "./nullable-integration.js";
import type { minimal_repository } from "./minimal-repository.js";
import type { simple_commit } from "./simple-commit.js";

/**
 * A suite of checks performed on the code of a given code change
 */
export type check_suite = {
  /**
   * @format int64
   * @example 5
   */
  id: number;
  /**
   * @example "MDEwOkNoZWNrU3VpdGU1"
   */
  node_id: string;
  /**
   * @example "master"
   */
  head_branch: string;
  /**
   * The SHA of the head commit that is being checked.
   * @example "009b8a3a9ccbb128af87f9b1c0f4c62e8a304f6d"
   */
  head_sha: string;
  /**
   * The phase of the lifecycle that the check suite is currently in. Statuses of waiting, requested, and pending are reserved for GitHub Actions check suites.
   * @example "completed"
   */
  status:
    | "queued"
    | "in_progress"
    | "completed"
    | "waiting"
    | "requested"
    | "pending";
  /**
   * @example "neutral"
   */
  conclusion:
    | "success"
    | "failure"
    | "neutral"
    | "cancelled"
    | "skipped"
    | "timed_out"
    | "action_required"
    | "startup_failure"
    | "stale"
    | null;
  /**
   * @example "https://api.github.com/repos/github/hello-world/check-suites/5"
   */
  url: string;
  /**
   * @example "146e867f55c26428e5f9fade55a9bbf5e95a7912"
   */
  before: string;
  /**
   * @example "d6fde92930d4715a2b49857d24b940956b26d2d3"
   */
  after: string;
  pull_requests: Array<pull_request_minimal>;
  app: nullable_integration;
  repository: minimal_repository;
  /**
   * @format date-time
   */
  created_at: string;
  /**
   * @format date-time
   */
  updated_at: string;
  head_commit: simple_commit;
  latest_check_runs_count: number;
  check_runs_url: string;
  rerequestable?: boolean;
  runs_rerequestable?: boolean;
};
