export type ConversationSentimentAnalysis = {
  overall_label: "positive" | "neutral" | "negative";
  overall_sentiment_score: number;
  overall_frustration_score: number;
  min_user_sentiment_score: number;
  max_user_frustration_score: number;
  num_scored_user_turns: number;
};
