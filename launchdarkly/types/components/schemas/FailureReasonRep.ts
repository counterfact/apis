export type FailureReasonRep = {
  /**
   * The attribute that failed validation
   * @example "projectKey"
   */
  attribute: string;
  /**
   * The reason the attribute failed validation
   * @example "must be present"
   */
  reason: string;
};
