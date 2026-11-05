export type ExactParameterEvaluationStrategy = {
  type: "exact";
  /**
   * The exact string value that the parameter must match.
   */
  expected_value: string;
};
