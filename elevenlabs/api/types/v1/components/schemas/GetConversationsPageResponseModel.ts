import type { ConversationSummaryResponseModel } from "./ConversationSummaryResponseModel.js";
export type GetConversationsPageResponseModel = {
  conversations: Array<ConversationSummaryResponseModel>;
  next_cursor?: string | null;
  has_more: boolean;
};
