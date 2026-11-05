/**
 * A failed media generation and why it failed.
 * @example {"error_message":"Timed out while processing. You were not charged for this generation.","failure_reason":"timeout","id":"JWr5N6X9ZTqf8jD2LmQb","status":"failed"}
 */
export type MediaGenerationFailedResponse = {
  /**
   * The unique identifier of the generation.
   */
  id: string;
  /**
   * The lifecycle status of the generation.
   */
  status: "failed";
  /**
   * The category of failure.
   */
  failure_reason:
    | "timeout"
    | "model_error"
    | "moderated"
    | "invalid_parameters"
    | "dependency_failed"
    | "charging_failed"
    | "internal_error";
  /**
   * A human-readable description of the failure. Failed generations are not charged.
   */
  error_message: string;
};
