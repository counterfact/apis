import type { protected_branch_required_status_check } from "./protected-branch-required-status-check.js";
import type { protected_branch_admin_enforced } from "./protected-branch-admin-enforced.js";
import type { protected_branch_pull_request_review } from "./protected-branch-pull-request-review.js";
import type { branch_restriction_policy } from "./branch-restriction-policy.js";

/**
 * Branch Protection
 */
export type branch_protection = {
  url?: string;
  enabled?: boolean;
  required_status_checks?: protected_branch_required_status_check;
  enforce_admins?: protected_branch_admin_enforced;
  required_pull_request_reviews?: protected_branch_pull_request_review;
  restrictions?: branch_restriction_policy;
  required_linear_history?: { enabled?: boolean };
  allow_force_pushes?: { enabled?: boolean };
  allow_deletions?: { enabled?: boolean };
  block_creations?: { enabled?: boolean };
  required_conversation_resolution?: { enabled?: boolean };
  /**
   * @example "\"branch/with/protection\""
   */
  name?: string;
  /**
   * @example "\"https://api.github.com/repos/owner-79e94e2d36b3fd06a32bb213/AAA_Public_Repo/branches/branch/with/protection/protection\""
   */
  protection_url?: string;
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
