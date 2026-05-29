import type { repository_rule_params_workflow_file_reference } from "./repository-rule-params-workflow-file-reference.js";

/**
 * Require all changes made to a targeted branch to pass the specified workflows before they can be merged.
 */
export type repository_rule_workflows = {
  type: "workflows";
  parameters?: {
    /**
     * Allow repositories and branches to be created if a check would otherwise prohibit it.
     */
    do_not_enforce_on_create?: boolean;
    /**
     * Workflows that must pass for this rule to pass.
     */
    workflows: Array<repository_rule_params_workflow_file_reference>;
  };
};
