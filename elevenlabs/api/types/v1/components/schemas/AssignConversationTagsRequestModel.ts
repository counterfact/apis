export type AssignConversationTagsRequestModel = {
  /**
   * Tag IDs to add to the conversation. Re-assigning an existing tag is a no-op.
   */
  tag_ids: Array<string>;
};
