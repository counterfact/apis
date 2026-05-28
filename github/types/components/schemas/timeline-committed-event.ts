/**
 * Timeline Committed Event
 */
export type timeline_committed_event = {
  event?: string;
  /**
   * SHA for the commit
   * @example "7638417db6d59f3c431d3e1f261cc637155684cd"
   */
  sha: string;
  node_id: string;
  /**
   * @format uri
   */
  url: string;
  /**
   * Identifying information for the git-user
   */
  author: {
    /**
     * Timestamp of the commit
     * @format date-time
     * @example "2014-08-09T08:02:04+12:00"
     */
    date: string;
    /**
     * Git email address of the user
     * @example "monalisa.octocat@example.com"
     */
    email: string;
    /**
     * Name of the git user
     * @example "Monalisa Octocat"
     */
    name: string;
  };
  /**
   * Identifying information for the git-user
   */
  committer: {
    /**
     * Timestamp of the commit
     * @format date-time
     * @example "2014-08-09T08:02:04+12:00"
     */
    date: string;
    /**
     * Git email address of the user
     * @example "monalisa.octocat@example.com"
     */
    email: string;
    /**
     * Name of the git user
     * @example "Monalisa Octocat"
     */
    name: string;
  };
  /**
   * Message describing the purpose of the commit
   * @example "Fix #42"
   */
  message: string;
  tree: {
    /**
     * SHA for the commit
     * @example "7638417db6d59f3c431d3e1f261cc637155684cd"
     */
    sha: string;
    /**
     * @format uri
     */
    url: string;
  };
  parents: Array<{
    /**
     * SHA for the commit
     * @example "7638417db6d59f3c431d3e1f261cc637155684cd"
     */
    sha: string;
    /**
     * @format uri
     */
    url: string;
    /**
     * @format uri
     */
    html_url: string;
  }>;
  verification: {
    verified: boolean;
    reason: string;
    signature: string;
    payload: string;
    verified_at: string;
  };
  /**
   * @format uri
   */
  html_url: string;
};
