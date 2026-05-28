import type { repository_rule_params_reviewer } from "./repository-rule-params-reviewer.js";

/**
 * A reviewing team, and file patterns describing which files they must approve changes to.
 */
export type repository_rule_params_required_reviewer_configuration = {
  /**
   * Array of file patterns. Pull requests which change matching files must be approved by the specified team. File patterns use fnmatch syntax.
   */
  file_patterns: Array<string>;
  /**
   * Minimum number of approvals required from the specified team. If set to zero, the team will be added to the pull request but approval is optional.
   */
  minimum_approvals: number;
  reviewer: repository_rule_params_reviewer;
};
