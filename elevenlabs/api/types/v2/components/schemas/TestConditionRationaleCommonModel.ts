/**
 * Structured rationale for test condition results containing individual failure/success reasons.
 */
export type TestConditionRationaleCommonModel = {
  /**
   * List of individual parameter evaluation messages or reasons
   */
  messages?: Array<string>;
  /**
   * High-level summary of the evaluation result
   * @default ""
   */
  summary?: string;
};
