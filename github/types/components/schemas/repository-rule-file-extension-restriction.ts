/**
 * Prevent commits that include files with specified file extensions from being pushed to the commit graph.
 */
export type repository_rule_file_extension_restriction = {
  type: "file_extension_restriction";
  parameters?: {
    /**
     * The file extensions that are restricted from being pushed to the commit graph.
     */
    restricted_file_extensions: Array<string>;
  };
};
