export type SentimentAggregate = {
  scored_conversation_count: number;
  positive_count: number;
  neutral_count: number;
  negative_count: number;
  average_sentiment_score: number | null;
  average_frustration_score: number | null;
  recent_scored_conversation_count: number;
  recent_positive_count: number;
  recent_neutral_count: number;
  recent_negative_count: number;
  recent_average_sentiment_score: number | null;
  recent_average_frustration_score: number | null;
};
