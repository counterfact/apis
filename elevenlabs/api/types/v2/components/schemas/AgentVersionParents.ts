export type AgentVersionParents = {
  in_branch_parent_id?: string | null;
  out_of_branch_parent_id?: string | null;
  merged_into_branch_id?: string | null;
  merged_from_branch_id?: string | null;
  merged_from_version_id?: string | null;
  rebased_from_version_id?: string | null;
};
