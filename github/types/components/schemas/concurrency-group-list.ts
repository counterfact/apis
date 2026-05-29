/**
 * A list of active concurrency groups for a repository.
 */
export type concurrency_group_list = {
  total_count: number;
  concurrency_groups: Array<{
    /**
     * The name of the concurrency group.
     */
    group_name: string;
    /**
     * API URL for this concurrency group.
     * @format uri
     */
    group_url: string;
    /**
     * @format date-time
     */
    last_acquired_at: string;
  }>;
};
