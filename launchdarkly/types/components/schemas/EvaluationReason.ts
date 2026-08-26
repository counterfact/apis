export type EvaluationReason = {
  /**
   * Describes the general reason that LaunchDarkly selected this variation.
   * @example "OFF"
   */
  kind: string;
  /**
   * The positional index of the matching rule if the kind is 'RULE_MATCH'. The index is 0-based.
   * @example 3
   */
  ruleIndex?: number;
  /**
   * The unique identifier of the matching rule if the kind is 'RULE_MATCH'.
   * @example "1234567890"
   */
  ruleID?: string;
  /**
   * The key of the flag that failed if the kind is 'PREREQUISITE_FAILED'.
   * @example "someotherflagkey"
   */
  prerequisiteKey?: string;
  /**
   * Indicates whether the evaluation occurred as part of an experiment.
   * @example true
   */
  inExperiment?: boolean;
  /**
   * The specific error type if the kind is 'ERROR'.
   * @example "USER_NOT_SPECIFIED"
   */
  errorKind?: string;
};
