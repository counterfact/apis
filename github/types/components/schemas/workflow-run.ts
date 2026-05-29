import type { referenced_workflow } from "./referenced-workflow.js";
import type { pull_request_minimal } from "./pull-request-minimal.js";
import type { simple_user } from "./simple-user.js";
import type { nullable_simple_commit } from "./nullable-simple-commit.js";
import type { minimal_repository } from "./minimal-repository.js";

/**
 * An invocation of a workflow
 */
export type workflow_run = {
  /**
   * The ID of the workflow run.
   * @example 5
   */
  id: number;
  /**
   * The name of the workflow run.
   * @example "Build"
   */
  name?: string;
  /**
   * @example "MDEwOkNoZWNrU3VpdGU1"
   */
  node_id: string;
  /**
   * The ID of the associated check suite.
   * @example 42
   */
  check_suite_id?: number;
  /**
   * The node ID of the associated check suite.
   * @example "MDEwOkNoZWNrU3VpdGU0Mg=="
   */
  check_suite_node_id?: string;
  /**
   * @example "master"
   */
  head_branch: string;
  /**
   * The SHA of the head commit that points to the version of the workflow being run.
   * @example "009b8a3a9ccbb128af87f9b1c0f4c62e8a304f6d"
   */
  head_sha: string;
  /**
   * The full path of the workflow
   * @example "octocat/octo-repo/.github/workflows/ci.yml@main"
   */
  path: string;
  /**
   * The auto incrementing run number for the workflow run.
   * @example 106
   */
  run_number: number;
  /**
   * Attempt number of the run, 1 for first attempt and higher if the workflow was re-run.
   * @example 1
   */
  run_attempt?: number;
  referenced_workflows?: Array<referenced_workflow>;
  /**
   * @example "push"
   */
  event: string;
  /**
   * @example "completed"
   */
  status: string;
  /**
   * @example "neutral"
   */
  conclusion: string;
  /**
   * The ID of the parent workflow.
   * @example 5
   */
  workflow_id: number;
  /**
   * The URL to the workflow run.
   * @example "https://api.github.com/repos/github/hello-world/actions/runs/5"
   */
  url: string;
  /**
   * @example "https://github.com/github/hello-world/suites/4"
   */
  html_url: string;
  /**
   * Pull requests that are open with a `head_sha` or `head_branch` that matches the workflow run. The returned pull requests do not necessarily indicate pull requests that triggered the run.
   */
  pull_requests: Array<pull_request_minimal>;
  /**
   * @format date-time
   */
  created_at: string;
  /**
   * @format date-time
   */
  updated_at: string;
  actor?: simple_user;
  triggering_actor?: simple_user;
  /**
   * The start time of the latest run. Resets on re-run.
   * @format date-time
   */
  run_started_at?: string;
  /**
   * The URL to the jobs for the workflow run.
   * @example "https://api.github.com/repos/github/hello-world/actions/runs/5/jobs"
   */
  jobs_url: string;
  /**
   * The URL to download the logs for the workflow run.
   * @example "https://api.github.com/repos/github/hello-world/actions/runs/5/logs"
   */
  logs_url: string;
  /**
   * The URL to the associated check suite.
   * @example "https://api.github.com/repos/github/hello-world/check-suites/12"
   */
  check_suite_url: string;
  /**
   * The URL to the artifacts for the workflow run.
   * @example "https://api.github.com/repos/github/hello-world/actions/runs/5/rerun/artifacts"
   */
  artifacts_url: string;
  /**
   * The URL to cancel the workflow run.
   * @example "https://api.github.com/repos/github/hello-world/actions/runs/5/cancel"
   */
  cancel_url: string;
  /**
   * The URL to rerun the workflow run.
   * @example "https://api.github.com/repos/github/hello-world/actions/runs/5/rerun"
   */
  rerun_url: string;
  /**
   * The URL to the previous attempted run of this workflow, if one exists.
   * @example "https://api.github.com/repos/github/hello-world/actions/runs/5/attempts/3"
   */
  previous_attempt_url?: string;
  /**
   * The URL to the workflow.
   * @example "https://api.github.com/repos/github/hello-world/actions/workflows/main.yaml"
   */
  workflow_url: string;
  head_commit: nullable_simple_commit;
  repository: minimal_repository;
  head_repository: minimal_repository;
  /**
   * @example 5
   */
  head_repository_id?: number;
  /**
   * The event-specific title associated with the run or the run-name if set, or the value of `run-name` if it is set in the workflow.
   * @example "Simple Workflow"
   */
  display_title: string;
};
