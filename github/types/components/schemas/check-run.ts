import type { nullable_integration } from "./nullable-integration.js";
import type { pull_request_minimal } from "./pull-request-minimal.js";
import type { deployment_simple } from "./deployment-simple.js";

/**
 * A check performed on the code of a given code change
 */
export type check_run = {
  /**
   * The id of the check.
   * @format int64
   * @example 21
   */
  id: number;
  /**
   * The SHA of the commit that is being checked.
   * @example "009b8a3a9ccbb128af87f9b1c0f4c62e8a304f6d"
   */
  head_sha: string;
  /**
   * @example "MDg6Q2hlY2tSdW40"
   */
  node_id: string;
  /**
   * @example "42"
   */
  external_id: string;
  /**
   * @example "https://api.github.com/repos/github/hello-world/check-runs/4"
   */
  url: string;
  /**
   * @example "https://github.com/github/hello-world/runs/4"
   */
  html_url: string;
  /**
   * @example "https://example.com"
   */
  details_url: string;
  /**
   * The phase of the lifecycle that the check is currently in. Statuses of waiting, requested, and pending are reserved for GitHub Actions check runs.
   * @example "queued"
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
    | "action_required";
  /**
   * @format date-time
   * @example "2018-05-04T01:14:52Z"
   */
  started_at: string;
  /**
   * @format date-time
   * @example "2018-05-04T01:14:52Z"
   */
  completed_at: string;
  output: {
    title: string;
    summary: string;
    text: string;
    annotations_count: number;
    /**
     * @format uri
     */
    annotations_url: string;
  };
  /**
   * The name of the check.
   * @example "test-coverage"
   */
  name: string;
  check_suite: { id: number };
  app: nullable_integration;
  /**
   * Pull requests that are open with a `head_sha` or `head_branch` that matches the check. The returned pull requests do not necessarily indicate pull requests that triggered the check.
   */
  pull_requests: Array<pull_request_minimal>;
  deployment?: deployment_simple;
};
