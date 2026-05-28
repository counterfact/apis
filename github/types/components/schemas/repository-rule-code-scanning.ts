import type { repository_rule_params_code_scanning_tool } from "./repository-rule-params-code-scanning-tool.js";

/**
 * Choose which tools must provide code scanning results before the reference is updated. When configured, code scanning must be enabled and have results for both the commit and the reference being updated.
 */
export type repository_rule_code_scanning = {
  type: "code_scanning";
  parameters?: {
    /**
     * Tools that must provide code scanning results for this rule to pass.
     */
    code_scanning_tools: Array<repository_rule_params_code_scanning_tool>;
  };
};
