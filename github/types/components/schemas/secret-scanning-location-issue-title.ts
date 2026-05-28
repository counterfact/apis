/**
 * Represents an 'issue_title' secret scanning location type. This location type shows that a secret was detected in the title of an issue.
 */
export type secret_scanning_location_issue_title = {
  /**
   * The API URL to get the issue where the secret was detected.
   * @format uri
   * @example "https://api.github.com/repos/octocat/Hello-World/issues/1347"
   */
  issue_title_url: string;
  /**
   * The GitHub URL for the issue where the secret was detected.
   * @format uri
   * @example "https://github.com/octocat/Hello-World/issues/1"
   */
  html_url?: string;
};
