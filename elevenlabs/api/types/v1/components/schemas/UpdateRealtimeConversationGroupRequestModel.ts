/**
 * Only fields present in the request are applied; `description=None` clears it.
 */
export type UpdateRealtimeConversationGroupRequestModel = {
  /**
   * Name of the conversation group. Names are unique per workspace, ignoring case and extra whitespace, and at most 64 characters.
   */
  title?: string | null;
  /**
   * New description of the conversation group.
   */
  description?: string | null;
};
