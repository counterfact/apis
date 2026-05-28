/**
 * Repository invitations let you manage who you collaborate with.
 */
export type repository_subscription = {
  /**
   * Determines if notifications should be received from this repository.
   * @example true
   */
  subscribed: boolean;
  /**
   * Determines if all notifications should be blocked from this repository.
   */
  ignored: boolean;
  reason: string;
  /**
   * @format date-time
   * @example "2012-10-06T21:34:12Z"
   */
  created_at: string;
  /**
   * @format uri
   * @example "https://api.github.com/repos/octocat/example/subscription"
   */
  url: string;
  /**
   * @format uri
   * @example "https://api.github.com/repos/octocat/example"
   */
  repository_url: string;
};
