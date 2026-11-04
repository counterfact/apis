import type { AlertingMonitorConfig } from "./AlertingMonitorConfig.js";
import type { AlertingWebhookNotifierResponse } from "./AlertingWebhookNotifierResponse.js";
import type { AlertingPagerDutyNotifierResponse } from "./AlertingPagerDutyNotifierResponse.js";
import type { AlertingSlackNotifierResponse } from "./AlertingSlackNotifierResponse.js";
/**
 * Customer-facing view of alerting settings. Unlike AdminAlertingSettingsResponse,
 * it has no internal_notifiers field: those are ElevenLabs-internal delivery
 * channels whose URLs must never be returned outside the admin API.
 */
export type AlertingSettingsResponse = {
  monitor_configs?: { [key: string]: AlertingMonitorConfig };
  auto_resolve_after_inactive_minutes?: number | null;
  notifiers?: Array<
    | AlertingWebhookNotifierResponse
    | AlertingPagerDutyNotifierResponse
    | AlertingSlackNotifierResponse
  >;
};
