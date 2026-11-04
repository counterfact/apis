import type { TopicSentimentAggregate } from "./TopicSentimentAggregate.js";
import type { TopicEvaluationCriteriaAggregate } from "./TopicEvaluationCriteriaAggregate.js";
export type TopicMetricsAggregate = {
  /**
   * @default 0
   */
  conversation_count?: number;
  sentiment?: TopicSentimentAggregate | null;
  evaluation_criteria?: Array<TopicEvaluationCriteriaAggregate>;
};
