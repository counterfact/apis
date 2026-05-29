/**
 * Prevent commits that include changes in specified file and folder paths from being pushed to the commit graph. This includes absolute paths that contain file names.
 */
export type repository_rule_file_path_restriction = {
  type: "file_path_restriction";
  parameters?: {
    /**
     * The file paths that are restricted from being pushed to the commit graph.
     */
    restricted_file_paths: Array<string>;
  };
};
