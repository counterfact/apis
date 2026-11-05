export type CreateRealtimeConversationGroupRequestModel = {
  /**
   * Name of the conversation group. Names are unique per workspace, ignoring case and extra whitespace, and at most 64 characters.
   */
  title: string;
  /**
   * Optional description of the conversation group.
   */
  description?: string | null;
};
