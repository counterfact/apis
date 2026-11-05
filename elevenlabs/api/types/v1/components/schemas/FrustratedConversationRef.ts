export type FrustratedConversationRef = {
  conversation_id: string;
  agent_id: string;
  start_time_unix_secs: number;
  overall_label: "positive" | "neutral" | "negative";
  overall_sentiment_score: number;
  overall_frustration_score: number;
};
