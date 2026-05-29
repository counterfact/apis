export type code_scanning_autofix_commits_response = {
  /**
   * The Git reference of target branch for the commit. For more information, see "[Git References](https://git-scm.com/book/en/v2/Git-Internals-Git-References)" in the Git documentation.
   */
  target_ref?: string;
  /**
   * SHA of commit with autofix.
   */
  sha?: string;
};
