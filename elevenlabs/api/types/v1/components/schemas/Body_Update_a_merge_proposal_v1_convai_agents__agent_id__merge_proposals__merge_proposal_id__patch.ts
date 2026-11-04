export type Body_Update_a_merge_proposal_v1_convai_agents__agent_id__merge_proposals__merge_proposal_id__patch =
  {
    /**
     * New title for the merge_proposal.
     */
    title?: string | null;
    /**
     * New description for the merge_proposal.
     */
    description?: string | null;
    /**
     * Replacement list of user IDs to request a review from.
     */
    requested_reviewer_user_ids?: Array<string> | null;
    /**
     * When true, close the merge_proposal without merging.
     * @default false
     */
    close?: boolean;
  };
