import type { FailureReasonRep } from "./FailureReasonRep.js";

export type ValidationFailedErrorRep = {
  /**
   * Specific error code encountered
   * @example "invalid_request"
   */
  code: string;
  /**
   * Description of the error
   * @example "validation failed"
   */
  message: string;
  /**
   * List of validation errors
   */
  errors: Array<FailureReasonRep>;
};
