import type { minimal_repository } from "./minimal-repository.js";
import type { nullable_simple_user } from "./nullable-simple-user.js";

/**
 * Repository invitations let you manage who you collaborate with.
 */
export type repository_invitation = {
  /**
   * Unique identifier of the repository invitation.
   * @format int64
   * @example 42
   */
  id: number;
  repository: minimal_repository;
  invitee: nullable_simple_user;
  inviter: nullable_simple_user;
  /**
   * The permission associated with the invitation.
   * @example "read"
   */
  permissions: "read" | "write" | "admin" | "triage" | "maintain";
  /**
   * @format date-time
   * @example "2016-06-13T14:52:50-05:00"
   */
  created_at: string;
  /**
   * Whether or not the invitation has expired
   */
  expired?: boolean;
  /**
   * URL for the repository invitation
   * @example "https://api.github.com/user/repository-invitations/1"
   */
  url: string;
  /**
   * @example "https://github.com/octocat/Hello-World/invitations"
   */
  html_url: string;
  node_id: string;
};
