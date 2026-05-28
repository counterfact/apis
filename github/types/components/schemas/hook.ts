import type { webhook_config } from "./webhook-config.js";
import type { hook_response } from "./hook-response.js";

/**
 * Webhooks for repositories.
 */
export type hook = {
  type: string;
  /**
   * Unique identifier of the webhook.
   * @example 42
   */
  id: number;
  /**
   * The name of a valid service, use 'web' for a webhook.
   * @example "web"
   */
  name: string;
  /**
   * Determines whether the hook is actually triggered on pushes.
   * @example true
   */
  active: boolean;
  /**
   * Determines what events the hook is triggered for. Default: ['push'].
   * @example ["push","pull_request"]
   */
  events: Array<string>;
  config: webhook_config;
  /**
   * @format date-time
   * @example "2011-09-06T20:39:23Z"
   */
  updated_at: string;
  /**
   * @format date-time
   * @example "2011-09-06T17:26:27Z"
   */
  created_at: string;
  /**
   * @format uri
   * @example "https://api.github.com/repos/octocat/Hello-World/hooks/1"
   */
  url: string;
  /**
   * @format uri
   * @example "https://api.github.com/repos/octocat/Hello-World/hooks/1/test"
   */
  test_url: string;
  /**
   * @format uri
   * @example "https://api.github.com/repos/octocat/Hello-World/hooks/1/pings"
   */
  ping_url: string;
  /**
   * @format uri
   * @example "https://api.github.com/repos/octocat/Hello-World/hooks/1/deliveries"
   */
  deliveries_url?: string;
  last_response: hook_response;
};
