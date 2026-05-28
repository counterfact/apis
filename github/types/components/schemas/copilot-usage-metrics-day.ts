import type { copilot_ide_code_completions } from "./copilot-ide-code-completions.js";
import type { copilot_ide_chat } from "./copilot-ide-chat.js";
import type { copilot_dotcom_chat } from "./copilot-dotcom-chat.js";
import type { copilot_dotcom_pull_requests } from "./copilot-dotcom-pull-requests.js";

/**
 * Copilot usage metrics for a given day.
 */
export type copilot_usage_metrics_day = {
  /**
   * The date for which the usage metrics are aggregated, in `YYYY-MM-DD` format.
   * @format date
   */
  date: string;
  /**
   * The total number of Copilot users with activity belonging to any Copilot feature, globally, for the given day. Includes passive activity such as receiving a code suggestion, as well as engagement activity such as accepting a code suggestion or prompting chat. Does not include authentication events. Is not limited to the individual features detailed on the endpoint.
   */
  total_active_users?: number;
  /**
   * The total number of Copilot users who engaged with any Copilot feature, for the given day. Examples include but are not limited to accepting a code suggestion, prompting Copilot chat, or triggering a PR Summary. Does not include authentication events. Is not limited to the individual features detailed on the endpoint.
   */
  total_engaged_users?: number;
  copilot_ide_code_completions?: copilot_ide_code_completions;
  copilot_ide_chat?: copilot_ide_chat;
  copilot_dotcom_chat?: copilot_dotcom_chat;
  copilot_dotcom_pull_requests?: copilot_dotcom_pull_requests;
  [key: string]: unknown;
};
