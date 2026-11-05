export type TopicEvaluationCriteriaAggregate = {
  criteria_id: string;
  /**
   * @default 0
   */
  success_count?: number;
  /**
   * @default 0
   */
  failure_count?: number;
  /**
   * @default 0
   */
  unknown_count?: number;
};
