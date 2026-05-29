export type actions_fork_pr_contributor_approval = {
  /**
   * The policy that controls when fork PR workflows require approval from a maintainer.
   */
  approval_policy:
    | "first_time_contributors_new_to_github"
    | "first_time_contributors"
    | "all_external_contributors";
};
