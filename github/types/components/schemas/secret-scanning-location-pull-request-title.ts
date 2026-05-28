/**
 * Represents a 'pull_request_title' secret scanning location type. This location type shows that a secret was detected in the title of a pull request.
 */
export type secret_scanning_location_pull_request_title = {
  /**
   * The API URL to get the pull request where the secret was detected.
   * @format uri
   * @example "https://api.github.com/repos/octocat/Hello-World/pulls/2846"
   */
  pull_request_title_url: string;
  /**
   * The GitHub URL for the pull request where the secret was detected.
   * @format uri
   * @example "https://github.com/octocat/Hello-World/pull/2846"
   */
  html_url?: string;
};
