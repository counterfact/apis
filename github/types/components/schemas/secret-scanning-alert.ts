import type { alert_number } from "./alert-number.js";
import type { alert_created_at } from "./alert-created-at.js";
import type { nullable_alert_updated_at } from "./nullable-alert-updated-at.js";
import type { alert_url } from "./alert-url.js";
import type { alert_html_url } from "./alert-html-url.js";
import type { secret_scanning_alert_state } from "./secret-scanning-alert-state.js";
import type { secret_scanning_alert_resolution } from "./secret-scanning-alert-resolution.js";
import type { nullable_simple_user } from "./nullable-simple-user.js";
import type { nullable_secret_scanning_first_detected_location } from "./nullable-secret-scanning-first-detected-location.js";

export type secret_scanning_alert = {
  number?: alert_number;
  created_at?: alert_created_at;
  updated_at?: nullable_alert_updated_at;
  url?: alert_url;
  html_url?: alert_html_url;
  /**
   * The REST API URL of the code locations for this alert.
   * @format uri
   */
  locations_url?: string;
  state?: secret_scanning_alert_state;
  resolution?: secret_scanning_alert_resolution;
  /**
   * The time that the alert was resolved in ISO 8601 format: `YYYY-MM-DDTHH:MM:SSZ`.
   * @format date-time
   */
  resolved_at?: string;
  resolved_by?: nullable_simple_user;
  /**
   * An optional comment to resolve an alert.
   */
  resolution_comment?: string;
  /**
   * The type of secret that secret scanning detected.
   */
  secret_type?: string;
  /**
   * User-friendly name for the detected secret, matching the `secret_type`.
   * For a list of built-in patterns, see "[Supported secret scanning patterns](https://docs.github.com/code-security/secret-scanning/introduction/supported-secret-scanning-patterns#supported-secrets)."
   */
  secret_type_display_name?: string;
  /**
   * The provider of the secret that was detected.
   */
  provider?: string;
  /**
   * The slug identifier for the provider of the secret that was detected. Use this value for filtering by provider with the `providers` or `exclude_providers` parameters.
   */
  provider_slug?: string;
  /**
   * The secret that was detected.
   */
  secret?: string;
  /**
   * Whether push protection was bypassed for the detected secret.
   */
  push_protection_bypassed?: boolean;
  push_protection_bypassed_by?: nullable_simple_user;
  /**
   * The time that push protection was bypassed in ISO 8601 format: `YYYY-MM-DDTHH:MM:SSZ`.
   * @format date-time
   */
  push_protection_bypassed_at?: string;
  push_protection_bypass_request_reviewer?: nullable_simple_user;
  /**
   * An optional comment when reviewing a push protection bypass.
   */
  push_protection_bypass_request_reviewer_comment?: string;
  /**
   * An optional comment when requesting a push protection bypass.
   */
  push_protection_bypass_request_comment?: string;
  /**
   * The URL to a push protection bypass request.
   * @format uri
   */
  push_protection_bypass_request_html_url?: string;
  /**
   * The token status as of the latest validity check.
   */
  validity?: "active" | "inactive" | "unknown";
  /**
   * Whether the detected secret was publicly leaked.
   */
  publicly_leaked?: boolean;
  /**
   * Whether the detected secret was found in multiple repositories under the same organization or enterprise.
   */
  multi_repo?: boolean;
  /**
   * A boolean value representing whether or not alert is base64 encoded
   */
  is_base64_encoded?: boolean;
  first_location_detected?: nullable_secret_scanning_first_detected_location;
  /**
   * A boolean value representing whether or not the token in the alert was detected in more than one location.
   */
  has_more_locations?: boolean;
  assigned_to?: nullable_simple_user;
  /**
   * An optional comment from the closure request author.
   */
  closure_request_comment?: string;
  /**
   * An optional comment from the closure request reviewer.
   */
  closure_request_reviewer_comment?: string;
  closure_request_reviewer?: nullable_simple_user;
};
