import type { simple_user } from "./simple-user.js";
import type { team } from "./team.js";
import type { integration } from "./integration.js";

/**
 * Protected Branch Pull Request Review
 */
export type protected_branch_pull_request_review = {
  /**
   * @format uri
   * @example "https://api.github.com/repos/octocat/Hello-World/branches/master/protection/dismissal_restrictions"
   */
  url?: string;
  dismissal_restrictions?: {
    /**
     * The list of users with review dismissal access.
     */
    users?: Array<simple_user>;
    /**
     * The list of teams with review dismissal access.
     */
    teams?: Array<team>;
    /**
     * The list of apps with review dismissal access.
     */
    apps?: Array<integration>;
    /**
     * @example "\"https://api.github.com/repos/the-org/an-org-repo/branches/master/protection/dismissal_restrictions\""
     */
    url?: string;
    /**
     * @example "\"https://api.github.com/repos/the-org/an-org-repo/branches/master/protection/dismissal_restrictions/users\""
     */
    users_url?: string;
    /**
     * @example "\"https://api.github.com/repos/the-org/an-org-repo/branches/master/protection/dismissal_restrictions/teams\""
     */
    teams_url?: string;
  };
  /**
   * Allow specific users, teams, or apps to bypass pull request requirements.
   */
  bypass_pull_request_allowances?: {
    /**
     * The list of users allowed to bypass pull request requirements.
     */
    users?: Array<simple_user>;
    /**
     * The list of teams allowed to bypass pull request requirements.
     */
    teams?: Array<team>;
    /**
     * The list of apps allowed to bypass pull request requirements.
     */
    apps?: Array<integration>;
  };
  /**
   * @example true
   */
  dismiss_stale_reviews: boolean;
  /**
   * @example true
   */
  require_code_owner_reviews: boolean;
  /**
   * @example 2
   */
  required_approving_review_count?: number;
  /**
   * Whether the most recent push must be approved by someone other than the person who pushed it.
   * @default false
   * @example true
   */
  require_last_push_approval?: boolean;
};
