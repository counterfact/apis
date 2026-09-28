import type { ExpiringTarget } from "./ExpiringTarget.js";
import type { ExpiringTargetError } from "./ExpiringTargetError.js";

export type ExpiringTargetPatchResponse = {
  /**
   * A list of the results from each instruction
   */
  items: Array<ExpiringTarget>;
  /**
   * The location and content type of related resources
   */
  _links?: { [key: string]: unknown };
  totalInstructions?: number;
  successfulInstructions?: number;
  failedInstructions?: number;
  errors?: Array<ExpiringTargetError>;
};
