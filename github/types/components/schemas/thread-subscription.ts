/**
 * Thread Subscription
 */
export type thread_subscription = {
  /**
   * @example true
   */
  subscribed: boolean;
  ignored: boolean;
  reason: string;
  /**
   * @format date-time
   * @example "2012-10-06T21:34:12Z"
   */
  created_at: string;
  /**
   * @format uri
   * @example "https://api.github.com/notifications/threads/1/subscription"
   */
  url: string;
  /**
   * @format uri
   * @example "https://api.github.com/notifications/threads/1"
   */
  thread_url?: string;
  /**
   * @format uri
   * @example "https://api.github.com/repos/1"
   */
  repository_url?: string;
};
