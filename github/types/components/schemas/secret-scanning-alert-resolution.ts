/**
 * **Required when the `state` is `resolved`.** The reason for resolving the alert.
 */
export type secret_scanning_alert_resolution =
  | "false_positive"
  | "wont_fix"
  | "revoked"
  | "used_in_tests";
