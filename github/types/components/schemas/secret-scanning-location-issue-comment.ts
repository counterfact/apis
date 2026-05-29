/**
 * Represents an 'issue_comment' secret scanning location type. This location type shows that a secret was detected in a comment on an issue.
 */
export type secret_scanning_location_issue_comment = {
  /**
   * The API URL to get the issue comment where the secret was detected.
   * @format uri
   * @example "https://api.github.com/repos/octocat/Hello-World/issues/comments/1081119451"
   */
  issue_comment_url: string;
  /**
   * The GitHub URL for the issue comment where the secret was detected.
   * @format uri
   * @example "https://github.com/octocat/Hello-World/issues/1#issuecomment-1081119451"
   */
  html_url?: string;
};
