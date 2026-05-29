/**
 * Commit an autofix for a code scanning alert
 */
export type code_scanning_autofix_commits = {
  /**
   * The Git reference of target branch for the commit. Branch needs to already exist.  For more information, see "[Git References](https://git-scm.com/book/en/v2/Git-Internals-Git-References)" in the Git documentation.
   */
  target_ref?: string;
  /**
   * Commit message to be used.
   */
  message?: string;
};
