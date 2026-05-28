/**
 * Represents a 'pull_request_review' secret scanning location type. This location type shows that a secret was detected in a review on a pull request.
 */
export type secret_scanning_location_pull_request_review = {
  /**
   * The API URL to get the pull request review where the secret was detected.
   * @format uri
   * @example "https://api.github.com/repos/octocat/Hello-World/pulls/2846/reviews/80"
   */
  pull_request_review_url: string;
  /**
   * The GitHub URL for the pull request review where the secret was detected.
   * @format uri
   * @example "https://github.com/octocat/Hello-World/pull/2846#pullrequestreview-80"
   */
  html_url?: string;
};
