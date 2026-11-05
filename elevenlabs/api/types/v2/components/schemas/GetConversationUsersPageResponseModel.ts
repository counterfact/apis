import type { ConversationUserResponseModel } from "./ConversationUserResponseModel.js";
export type GetConversationUsersPageResponseModel = {
  users: Array<ConversationUserResponseModel>;
  next_cursor?: string | null;
  has_more: boolean;
};
