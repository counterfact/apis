/**
 * Git references within a repository
 */
export type git_ref = {
  ref: string;
  node_id: string;
  /**
   * @format uri
   */
  url: string;
  object: {
    type: string;
    /**
     * SHA for the reference
     * @example "7638417db6d59f3c431d3e1f261cc637155684cd"
     */
    sha: string;
    /**
     * @format uri
     */
    url: string;
  };
};
