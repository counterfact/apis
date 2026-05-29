import type { simple_user } from "./simple-user.js";

/**
 * Organization Invitation
 */
export type organization_invitation = {
  /**
   * @format int64
   */
  id: number;
  login: string;
  email: string;
  role: string;
  created_at: string;
  failed_at?: string;
  failed_reason?: string;
  inviter: simple_user;
  team_count: number;
  /**
   * @example "\"MDIyOk9yZ2FuaXphdGlvbkludml0YXRpb24x\""
   */
  node_id: string;
  /**
   * @example "\"https://api.github.com/organizations/16/invitations/1/teams\""
   */
  invitation_teams_url: string;
  /**
   * @example "\"member\""
   */
  invitation_source?: string;
};
