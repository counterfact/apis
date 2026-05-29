/**
 * Represents a 'pull_request_review_comment' secret scanning location type. This location type shows that a secret was detected in a review comment on a pull request.
 */
export type secret_scanning_location_pull_request_review_comment = {
  /**
   * The API URL to get the pull request review comment where the secret was detected.
   * @format uri
   * @example "https://api.github.com/repos/octocat/Hello-World/pulls/comments/12"
   */
  pull_request_review_comment_url: string;
  /**
   * The GitHub URL for the pull request review comment where the secret was detected.
   * @format uri
   * @example "https://github.com/octocat/Hello-World/pull/2846#discussion_r12"
   */
  html_url?: string;
};
