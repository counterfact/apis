export type PatchConversationTagRequestModel = {
  /**
   * If provided, replaces the tag title. Omit to leave unchanged.
   */
  title?: string | null;
  /**
   * If provided, replaces the tag description. Omit to leave unchanged.
   */
  description?: string | null;
};
