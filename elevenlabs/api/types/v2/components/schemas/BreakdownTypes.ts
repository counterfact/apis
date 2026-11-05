/**
 * How to break down the information. Cannot be "user" or "api_key" if include_workspace_metrics is False.
 */
export type BreakdownTypes =
  | "none"
  | "voice"
  | "voice_multiplier"
  | "user"
  | "groups"
  | "api_keys"
  | "all_api_keys"
  | "product_type"
  | "model"
  | "resource"
  | "request_queue"
  | "region"
  | "subresource_id"
  | "reporting_workspace_id"
  | "has_api_key"
  | "request_source";
