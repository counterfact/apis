import type { ExpiringUserTargetItem } from "./ExpiringUserTargetItem.js";
import type { ExpiringTargetError } from "./ExpiringTargetError.js";

export type ExpiringUserTargetPatchResponse = {
  /**
   * An array of expiring user targets
   */
  items: Array<ExpiringUserTargetItem>;
  /**
   * The location and content type of related resources
   */
  _links?: { [key: string]: unknown };
  /**
   * The total count of instructions sent in the PATCH request
   * @example 1
   */
  totalInstructions?: number;
  /**
   * The total count of successful instructions sent in the PATCH request
   * @example 1
   */
  successfulInstructions?: number;
  /**
   * The total count of the failed instructions sent in the PATCH request
   * @example 0
   */
  failedInstructions?: number;
  /**
   * An array of error messages for the failed instructions
   */
  errors?: Array<ExpiringTargetError>;
};
