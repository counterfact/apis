/**
 * Represents a 'pull_request_comment' secret scanning location type. This location type shows that a secret was detected in a comment on a pull request.
 */
export type secret_scanning_location_pull_request_comment = {
  /**
   * The API URL to get the pull request comment where the secret was detected.
   * @format uri
   * @example "https://api.github.com/repos/octocat/Hello-World/issues/comments/1081119451"
   */
  pull_request_comment_url: string;
  /**
   * The GitHub URL for the pull request comment where the secret was detected.
   * @format uri
   * @example "https://github.com/octocat/Hello-World/pull/2846#issuecomment-1081119451"
   */
  html_url?: string;
};
