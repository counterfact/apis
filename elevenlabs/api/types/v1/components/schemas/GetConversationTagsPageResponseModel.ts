import type { ConversationTagResponseModel } from "./ConversationTagResponseModel.js";
export type GetConversationTagsPageResponseModel = {
  conversation_tags: Array<ConversationTagResponseModel>;
  next_cursor?: string | null;
  has_more: boolean;
};
