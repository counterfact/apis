import type { EvaluationSuccessResult } from "./EvaluationSuccessResult.js";
import type { ConversationSummaryMessageModel } from "./ConversationSummaryMessageModel.js";
export type GetConversationSummaryResponseModel = {
  conversation_id: string;
  agent_id: string;
  status: "initiated" | "in-progress" | "processing" | "done" | "failed";
  /**
   * Short generated title for the conversation.
   */
  call_summary_title?: string | null;
  /**
   * Generated natural-language summary of the call.
   */
  transcript_summary?: string | null;
  call_successful?: EvaluationSuccessResult | null;
  /**
   * Number of plain chat message turns in the conversation.
   */
  message_count: number;
  /**
   * The plain chat messages (role and text only). Included only when message_count does not exceed the requested max_messages; otherwise null and messages_omitted is true.
   */
  messages?: Array<ConversationSummaryMessageModel> | null;
  /**
   * True when the chat messages were omitted because the conversation was too long. Fetch the full transcript for the messages.
   * @default false
   */
  messages_omitted?: boolean;
  /**
   * Guidance telling the agent how to get the full transcript.
   */
  note: string;
};
