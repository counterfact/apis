import type { RealtimeConversationGroupResponseModel } from "./RealtimeConversationGroupResponseModel.js";
export type RealtimeConversationGroupsResponseModel = {
  conversation_groups: Array<RealtimeConversationGroupResponseModel>;
  /**
   * Cursor to pass to the next request to fetch the following page.
   */
  next_cursor?: string | null;
  /**
   * Whether more conversation groups are available beyond this page.
   * @default false
   */
  has_more?: boolean;
};
