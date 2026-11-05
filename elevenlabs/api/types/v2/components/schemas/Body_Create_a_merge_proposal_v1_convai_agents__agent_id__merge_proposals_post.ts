export type Body_Create_a_merge_proposal_v1_convai_agents__agent_id__merge_proposals_post =
  {
    /**
     * Branch whose changes should be merged.
     */
    source_branch_id: string;
    /**
     * Branch that should receive the changes.
     */
    target_branch_id: string;
    /**
     * Short title for the merge_proposal.
     */
    title: string;
    /**
     * Optional longer description for reviewers.
     * @default ""
     */
    description?: string;
    /**
     * User IDs to request a review from.
     */
    requested_reviewer_user_ids?: Array<string> | null;
    /**
     * Triage ticket of this agent that the merge_proposal resolves. Merging it resolves the ticket if still open.
     */
    triage_ticket_id?: string | null;
  };
