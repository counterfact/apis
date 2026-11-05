export type RegexParameterEvaluationStrategy = {
  type: "regex";
  /**
   * A regex pattern to match the agent's response against.
   */
  pattern: string;
};
