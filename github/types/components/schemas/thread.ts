import type { minimal_repository } from "./minimal-repository.js";

/**
 * Thread
 */
export type thread = {
  id: string;
  repository: minimal_repository;
  subject: {
    title: string;
    url: string;
    latest_comment_url: string;
    type: string;
  };
  reason: string;
  unread: boolean;
  updated_at: string;
  last_read_at: string;
  url: string;
  /**
   * @example "https://api.github.com/notifications/threads/2/subscription"
   */
  subscription_url: string;
};
