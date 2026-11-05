import type { AuthConnectionDependencies } from "./AuthConnectionDependencies.js";
import type { AuthConnectionStatus } from "./AuthConnectionStatus.js";
/**
 * Response model for the internal Slack BYO bot auth connection.
 */
export type SlackBotAuthResponse = {
  name: string;
  /**
   * @default "slack_bot_auth"
   */
  auth_type?: "slack_bot_auth";
  /**
   * @default "Slack"
   */
  provider?: "Slack";
  id: string;
  used_by?: AuthConnectionDependencies | null;
  /**
   * @default "active"
   */
  status?: AuthConnectionStatus;
  status_detail?: string | null;
  status_updated_at?: string | null;
};
