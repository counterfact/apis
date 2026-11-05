/**
 * How widely a group is shared, besides its owner and workspace admins (who always have access).
 */
export type RealtimeConversationGroupSharingSummary = {
  /**
   * Distinct people besides the owner with access, whether shared directly or through a workspace group they belong to.
   */
  people_count: number;
  /**
   * Whether every workspace member has access to the group.
   * @default false
   */
  shared_with_everyone?: boolean;
  /**
   * The preset role every workspace member has, when shared with everyone. None for a workspace custom role.
   */
  everyone_role?: ("admin" | "editor" | "commenter" | "viewer") | null;
};
