import type { ConversationTokenPurpose } from "./ConversationTokenPurpose.js";
export type ConversationTokenResponseModel = {
  /**
   * The ID of the agent
   */
  agent_id: string;
  /**
   * The token for the agent
   */
  conversation_token: string;
  /**
   * The expiration time of the token in unix seconds
   */
  expiration_time_unix_secs?: number | null;
  /**
   * The ID of the conversation
   */
  conversation_id?: string | null;
  /**
   * The purpose of the token
   */
  purpose: ConversationTokenPurpose;
  /**
   * The user ID of the entity who requested the token
   */
  token_requester_user_id?: string | null;
};
