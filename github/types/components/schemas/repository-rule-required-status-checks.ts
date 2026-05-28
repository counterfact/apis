import type { repository_rule_params_status_check_configuration } from "./repository-rule-params-status-check-configuration.js";

/**
 * Choose which status checks must pass before the ref is updated. When enabled, commits must first be pushed to another ref where the checks pass.
 */
export type repository_rule_required_status_checks = {
  type: "required_status_checks";
  parameters?: {
    /**
     * Allow repositories and branches to be created if a check would otherwise prohibit it.
     */
    do_not_enforce_on_create?: boolean;
    /**
     * Status checks that are required.
     */
    required_status_checks: Array<repository_rule_params_status_check_configuration>;
    /**
     * Whether pull requests targeting a matching branch must be tested with the latest code. This setting will not take effect unless at least one status check is enabled.
     */
    strict_required_status_checks_policy: boolean;
  };
};
