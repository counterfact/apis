/**
 * A list of concurrency groups associated with a workflow run.
 */
export type concurrency_group_run_list = {
  /**
   * The total number of concurrency groups this workflow run participates in,
   * derived from the run's configuration. This count is not filtered by
   * whether the run currently holds or is waiting in each group, so it can
   * include groups whose `group_members` array is empty (for example, when
   * the run has already released its lease in that group).
   */
  total_count: number;
  concurrency_groups: Array<{
    /**
     * The name of the concurrency group.
     */
    group_name: string;
    /**
     * API URL for this concurrency group. May return 404 if the group
     * has no active items at the time it is requested, since the
     * get-by-name endpoint reports the live repo-wide state of a group
     * while this endpoint lists groups associated with a run by
     * configuration.
     * @format uri
     */
    group_url: string;
    /**
     * Items belonging to this workflow run that are either currently holding or
     * waiting for the concurrency group lease. May be empty if the run no
     * longer has any active or queued items in this group.
     */
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
       * Queue position. 0 means the item holds the concurrency lease (in_progress), 1 or higher means queued (pending).
       */
      position: number;
      /**
       * API URL to get items ahead of this item in the concurrency group.
       * @format uri
       */
      position_url: string;
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
  }>;
};
