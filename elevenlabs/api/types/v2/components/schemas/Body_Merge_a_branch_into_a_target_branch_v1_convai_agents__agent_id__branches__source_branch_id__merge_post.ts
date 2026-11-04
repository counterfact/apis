export type Body_Merge_a_branch_into_a_target_branch_v1_convai_agents__agent_id__branches__source_branch_id__merge_post =
  {
    /**
     * Whether to archive the source branch after merging
     * @default true
     */
    archive_source_branch?: boolean;
    /**
     * Force source branch changes onto the target, overriding timestamp-based conflict resolution
     * @default false
     */
    force?: boolean;
  };
