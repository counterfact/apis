/**
 * Prevent commits with individual files that exceed the specified limit from being pushed to the commit graph.
 */
export type repository_rule_max_file_size = {
  type: "max_file_size";
  parameters?: {
    /**
     * The maximum file size allowed in megabytes. This limit does not apply to Git Large File Storage (Git LFS).
     */
    max_file_size: number;
  };
};
