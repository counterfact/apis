import type { alert_number } from "./alert-number.js";
import type { dependabot_alert_package } from "./dependabot-alert-package.js";
import type { dependabot_alert_security_advisory } from "./dependabot-alert-security-advisory.js";
import type { dependabot_alert_security_vulnerability } from "./dependabot-alert-security-vulnerability.js";
import type { alert_url } from "./alert-url.js";
import type { alert_html_url } from "./alert-html-url.js";
import type { alert_created_at } from "./alert-created-at.js";
import type { alert_updated_at } from "./alert-updated-at.js";
import type { alert_dismissed_at } from "./alert-dismissed-at.js";
import type { nullable_simple_user } from "./nullable-simple-user.js";
import type { alert_fixed_at } from "./alert-fixed-at.js";
import type { alert_auto_dismissed_at } from "./alert-auto-dismissed-at.js";
import type { dependabot_alert_dismissal_request_simple } from "./dependabot-alert-dismissal-request-simple.js";
import type { simple_user } from "./simple-user.js";
import type { simple_repository } from "./simple-repository.js";

/**
 * A Dependabot alert.
 */
export type dependabot_alert_with_repository = {
  number: alert_number;
  /**
   * The state of the Dependabot alert.
   */
  state: "auto_dismissed" | "dismissed" | "fixed" | "open";
  /**
   * Details for the vulnerable dependency.
   */
  dependency: {
    package?: dependabot_alert_package;
    /**
     * The full path to the dependency manifest file, relative to the root of the repository.
     */
    manifest_path?: string;
    /**
     * The execution scope of the vulnerable dependency.
     */
    scope?: "development" | "runtime";
    /**
     * The vulnerable dependency's relationship to your project.
     *
     * > [!NOTE]
     * > We are rolling out support for dependency relationship across ecosystems. This value will be "unknown" for all dependencies in unsupported ecosystems.
     *
     */
    relationship?: "unknown" | "direct" | "transitive" | "inconclusive";
  };
  security_advisory: dependabot_alert_security_advisory;
  security_vulnerability: dependabot_alert_security_vulnerability;
  url: alert_url;
  html_url: alert_html_url;
  created_at: alert_created_at;
  updated_at: alert_updated_at;
  dismissed_at: alert_dismissed_at;
  dismissed_by: nullable_simple_user;
  /**
   * The reason that the alert was dismissed.
   */
  dismissed_reason:
    | "fix_started"
    | "inaccurate"
    | "no_bandwidth"
    | "not_used"
    | "tolerable_risk";
  /**
   * An optional comment associated with the alert's dismissal.
   */
  dismissed_comment: string;
  fixed_at: alert_fixed_at;
  auto_dismissed_at?: alert_auto_dismissed_at;
  dismissal_request?: dependabot_alert_dismissal_request_simple;
  /**
   * The users assigned to this alert.
   */
  assignees?: Array<simple_user>;
  repository: simple_repository;
};
