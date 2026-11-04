export type Body_Merge_a_merge_proposal_v1_convai_agents__agent_id__merge_proposals__merge_proposal_id__merge_post =
  {
    /**
     * Whether to archive the source branch after merging.
     * @default true
     */
    archive_source_branch?: boolean;
    /**
     * Force source branch changes onto the target, overriding timestamp-based conflict resolution.
     * @default false
     */
    force?: boolean;
  };
