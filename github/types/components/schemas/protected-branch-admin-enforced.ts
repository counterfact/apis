/**
 * Protected Branch Admin Enforced
 */
export type protected_branch_admin_enforced = {
  /**
   * @format uri
   * @example "https://api.github.com/repos/octocat/Hello-World/branches/master/protection/enforce_admins"
   */
  url: string;
  /**
   * @example true
   */
  enabled: boolean;
};
