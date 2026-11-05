import type { SentimentAggregate } from "./SentimentAggregate.js";
import type { FrustratedConversationRef } from "./FrustratedConversationRef.js";
export type ConversationUserResponseModel = {
  user_id: string;
  last_contact_unix_secs: number;
  first_contact_unix_secs: number;
  conversation_count: number;
  last_contact_agent_id?: string | null;
  last_contact_conversation_id: string;
  last_contact_agent_name?: string | null;
  sentiment: SentimentAggregate;
  most_frustrated_conversations?: Array<FrustratedConversationRef>;
};
