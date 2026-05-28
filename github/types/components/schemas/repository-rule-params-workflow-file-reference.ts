/**
 * A workflow that must run for this rule to pass
 */
export type repository_rule_params_workflow_file_reference = {
  /**
   * The path to the workflow file
   */
  path: string;
  /**
   * The ref (branch or tag) of the workflow file to use
   */
  ref?: string;
  /**
   * The ID of the repository where the workflow is defined
   */
  repository_id: number;
  /**
   * The commit SHA of the workflow file to use
   */
  sha?: string;
};
