export type SetConversationGroupRequestModel = {
  /**
   * The conversation group to place the conversation in. A conversation belongs to at most one group, so this moves it out of any current group.
   */
  conversation_group_id: string;
};
