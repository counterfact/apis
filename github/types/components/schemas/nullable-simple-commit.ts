/**
 * A commit.
 */
export type nullable_simple_commit = {
  /**
   * SHA for the commit
   * @example "7638417db6d59f3c431d3e1f261cc637155684cd"
   */
  id: string;
  /**
   * SHA for the commit's tree
   */
  tree_id: string;
  /**
   * Message describing the purpose of the commit
   * @example "Fix #42"
   */
  message: string;
  /**
   * Timestamp of the commit
   * @format date-time
   * @example "2014-08-09T08:02:04+12:00"
   */
  timestamp: string;
  /**
   * Information about the Git author
   */
  author: {
    /**
     * Name of the commit's author
     * @example "Monalisa Octocat"
     */
    name: string;
    /**
     * Git email address of the commit's author
     * @format email
     * @example "monalisa.octocat@example.com"
     */
    email: string;
  };
  /**
   * Information about the Git committer
   */
  committer: {
    /**
     * Name of the commit's committer
     * @example "Monalisa Octocat"
     */
    name: string;
    /**
     * Git email address of the commit's committer
     * @format email
     * @example "monalisa.octocat@example.com"
     */
    email: string;
  };
};
