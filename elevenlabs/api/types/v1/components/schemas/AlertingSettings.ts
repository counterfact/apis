import type { AlertingMonitorConfig } from "./AlertingMonitorConfig.js";
import type { AlertingWebhookNotifier } from "./AlertingWebhookNotifier.js";
import type { AlertingPagerDutyNotifier } from "./AlertingPagerDutyNotifier.js";
import type { AlertingSlackNotifier } from "./AlertingSlackNotifier.js";
/**
 * Alerting configuration used at both per-agent and per-workspace level.
 * Cascade order for per-monitor threshold and auto-resolve: agent → workspace →
 * system default.
 */
export type AlertingSettings = {
  /**
   * Alerting configuration keyed by monitor name.
   */
  monitor_configs?: { [key: string]: AlertingMonitorConfig };
  /**
   * How many minutes an alert can stay inactive before it is auto-resolved. Unset values fall through to the next layer.
   */
  auto_resolve_after_inactive_minutes?: number | null;
  /**
   * Delivery channels for alert lifecycle notifications. Stacked with other layers and deduped by ``webhook_id``, PagerDuty ``connection_id``, or Slack ``(connection_id, channel_id)``.
   */
  notifiers?: Array<
    AlertingWebhookNotifier | AlertingPagerDutyNotifier | AlertingSlackNotifier
  >;
};
