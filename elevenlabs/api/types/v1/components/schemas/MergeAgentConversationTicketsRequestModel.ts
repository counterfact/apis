export type MergeAgentConversationTicketsRequestModel = {
  /**
   * Open tickets of the same agent to fold into this one. They are kept with status 'merged', pointing at this ticket.
   */
  source_ticket_ids: Array<string>;
};
