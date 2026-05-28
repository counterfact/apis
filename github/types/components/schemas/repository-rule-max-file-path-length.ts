/**
 * Prevent commits that include file paths that exceed the specified character limit from being pushed to the commit graph.
 */
export type repository_rule_max_file_path_length = {
  type: "max_file_path_length";
  parameters?: {
    /**
     * The maximum amount of characters allowed in file paths.
     */
    max_file_path_length: number;
  };
};
