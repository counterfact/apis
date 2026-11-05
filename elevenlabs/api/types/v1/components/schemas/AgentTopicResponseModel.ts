import type { TopicMetricsAggregate } from "./TopicMetricsAggregate.js";
export type AgentTopicResponseModel = {
  topic_id: string;
  label: string;
  description: string;
  conversation_count: number;
  parent_topic_id?: string | null;
  x_2d?: number | null;
  y_2d?: number | null;
  metrics?: TopicMetricsAggregate | null;
  /**
   * Success rate across the topic's evaluation criteria, weighted by scored conversations. Returned regardless of include_evaluation_criteria.
   */
  success_rate?: number | null;
};
