/**
 * Status Check Policy
 */
export type status_check_policy = {
  /**
   * @format uri
   * @example "https://api.github.com/repos/octocat/Hello-World/branches/master/protection/required_status_checks"
   */
  url: string;
  /**
   * @example true
   */
  strict: boolean;
  /**
   * @example ["continuous-integration/travis-ci"]
   */
  contexts: Array<string>;
  checks: Array<{
    /**
     * @example "continuous-integration/travis-ci"
     */
    context: string;
    app_id: number;
  }>;
  /**
   * @format uri
   * @example "https://api.github.com/repos/octocat/Hello-World/branches/master/protection/required_status_checks/contexts"
   */
  contexts_url: string;
};
