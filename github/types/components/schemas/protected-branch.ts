import type { status_check_policy } from "./status-check-policy.js";
import type { simple_user } from "./simple-user.js";
import type { team } from "./team.js";
import type { integration } from "./integration.js";
import type { branch_restriction_policy } from "./branch-restriction-policy.js";

/**
 * Branch protections protect branches
 */
export type protected_branch = {
  /**
   * @format uri
   */
  url: string;
  required_status_checks?: status_check_policy;
  required_pull_request_reviews?: {
    /**
     * @format uri
     */
    url: string;
    dismiss_stale_reviews?: boolean;
    require_code_owner_reviews?: boolean;
    required_approving_review_count?: number;
    /**
     * Whether the most recent push must be approved by someone other than the person who pushed it.
     * @default false
     */
    require_last_push_approval?: boolean;
    dismissal_restrictions?: {
      /**
       * @format uri
       */
      url: string;
      /**
       * @format uri
       */
      users_url: string;
      /**
       * @format uri
       */
      teams_url: string;
      users: Array<simple_user>;
      teams: Array<team>;
      apps?: Array<integration>;
    };
    bypass_pull_request_allowances?: {
      users: Array<simple_user>;
      teams: Array<team>;
      apps?: Array<integration>;
    };
  };
  required_signatures?: {
    /**
     * @format uri
     * @example "https://api.github.com/repos/octocat/Hello-World/branches/master/protection/required_signatures"
     */
    url: string;
    /**
     * @example true
     */
    enabled: boolean;
  };
  enforce_admins?: {
    /**
     * @format uri
     */
    url: string;
    enabled: boolean;
  };
  required_linear_history?: { enabled: boolean };
  allow_force_pushes?: { enabled: boolean };
  allow_deletions?: { enabled: boolean };
  restrictions?: branch_restriction_policy;
  required_conversation_resolution?: { enabled?: boolean };
  block_creations?: { enabled: boolean };
  /**
   * Whether to set the branch as read-only. If this is true, users will not be able to push to the branch.
   */
  lock_branch?: {
    /**
     * @default false
     */
    enabled?: boolean;
  };
  /**
   * Whether users can pull changes from upstream when the branch is locked. Set to `true` to allow fork syncing. Set to `false` to prevent fork syncing.
   */
  allow_fork_syncing?: {
    /**
     * @default false
     */
    enabled?: boolean;
  };
};
