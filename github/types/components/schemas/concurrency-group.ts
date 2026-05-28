/**
 * A concurrency group with the workflow runs and jobs that are either currently holding
 * or waiting for the concurrency group lease.
 */
export type concurrency_group = {
  /**
   * The name of the concurrency group.
   */
  group_name: string;
  /**
   * API URL for this concurrency group.
   * @format uri
   */
  group_url: string;
  total_count: number;
  group_members: Array<{
    /**
     * The ID of the workflow run.
     */
    run_id: number;
    /**
     * The name of the workflow run.
     */
    run_name: string;
    /**
     * API URL for the workflow run.
     * @format uri
     */
    run_url: string;
    /**
     * Web URL for the workflow run.
     * @format uri
     */
    run_html_url: string;
    /**
     * The ID of the job, when the item represents a job-level or reusable-workflow-level lease.
     */
    job_id?: number;
    /**
     * The display name of the job, when the item represents a job-level or reusable-workflow-level lease.
     */
    job_name?: string;
    /**
     * API URL for the job.
     * @format uri
     */
    job_url?: string;
    /**
     * Web URL for the job.
     * @format uri
     */
    job_html_url?: string;
    status: "in_progress" | "pending";
  }>;
};
