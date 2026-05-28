/**
 * Information of a job execution in a workflow run
 */
export type job = {
  /**
   * The id of the job.
   * @example 21
   */
  id: number;
  /**
   * The id of the associated workflow run.
   * @example 5
   */
  run_id: number;
  /**
   * @example "https://api.github.com/repos/github/hello-world/actions/runs/5"
   */
  run_url: string;
  /**
   * Attempt number of the associated workflow run, 1 for first attempt and higher if the workflow was re-run.
   * @example 1
   */
  run_attempt?: number;
  /**
   * @example "MDg6Q2hlY2tSdW40"
   */
  node_id: string;
  /**
   * The SHA of the commit that is being run.
   * @example "009b8a3a9ccbb128af87f9b1c0f4c62e8a304f6d"
   */
  head_sha: string;
  /**
   * @example "https://api.github.com/repos/github/hello-world/actions/jobs/21"
   */
  url: string;
  /**
   * @example "https://github.com/github/hello-world/runs/4"
   */
  html_url: string;
  /**
   * The phase of the lifecycle that the job is currently in.
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
   * The outcome of the job.
   * @example "success"
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
   * The time that the job created, in ISO 8601 format.
   * @format date-time
   * @example "2019-08-08T08:00:00-07:00"
   */
  created_at: string;
  /**
   * The time that the job started, in ISO 8601 format.
   * @format date-time
   * @example "2019-08-08T08:00:00-07:00"
   */
  started_at: string;
  /**
   * The time that the job finished, in ISO 8601 format.
   * @format date-time
   * @example "2019-08-08T08:00:00-07:00"
   */
  completed_at: string;
  /**
   * The name of the job.
   * @example "test-coverage"
   */
  name: string;
  /**
   * Steps in this job.
   */
  steps?: Array<{
    /**
     * The phase of the lifecycle that the job is currently in.
     * @example "queued"
     */
    status: "queued" | "in_progress" | "completed";
    /**
     * The outcome of the job.
     * @example "success"
     */
    conclusion: string;
    /**
     * The name of the job.
     * @example "test-coverage"
     */
    name: string;
    /**
     * @example 1
     */
    number: number;
    /**
     * The time that the step started, in ISO 8601 format.
     * @format date-time
     * @example "2019-08-08T08:00:00-07:00"
     */
    started_at?: string;
    /**
     * The time that the job finished, in ISO 8601 format.
     * @format date-time
     * @example "2019-08-08T08:00:00-07:00"
     */
    completed_at?: string;
  }>;
  /**
   * @example "https://api.github.com/repos/github/hello-world/check-runs/4"
   */
  check_run_url: string;
  /**
   * Labels for the workflow job. Specified by the "runs_on" attribute in the action's workflow file.
   * @example ["self-hosted","foo","bar"]
   */
  labels: Array<string>;
  /**
   * The ID of the runner to which this job has been assigned. (If a runner hasn't yet been assigned, this will be null.)
   * @example 1
   */
  runner_id: number;
  /**
   * The name of the runner to which this job has been assigned. (If a runner hasn't yet been assigned, this will be null.)
   * @example "my runner"
   */
  runner_name: string;
  /**
   * The ID of the runner group to which this job has been assigned. (If a runner hasn't yet been assigned, this will be null.)
   * @example 2
   */
  runner_group_id: number;
  /**
   * The name of the runner group to which this job has been assigned. (If a runner hasn't yet been assigned, this will be null.)
   * @example "my runner group"
   */
  runner_group_name: string;
  /**
   * The name of the workflow.
   * @example "Build"
   */
  workflow_name: string;
  /**
   * The name of the current branch.
   * @example "main"
   */
  head_branch: string;
};
