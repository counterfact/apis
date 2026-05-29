/**
 * A code security configuration
 */
export type code_security_configuration = {
  /**
   * The ID of the code security configuration
   */
  id?: number;
  /**
   * The name of the code security configuration. Must be unique within the organization.
   */
  name?: string;
  /**
   * The type of the code security configuration.
   */
  target_type?: "global" | "organization" | "enterprise";
  /**
   * A description of the code security configuration
   */
  description?: string;
  /**
   * The enablement status of GitHub Advanced Security
   */
  advanced_security?:
    | "enabled"
    | "disabled"
    | "code_security"
    | "secret_protection";
  /**
   * The enablement status of Dependency Graph
   */
  dependency_graph?: "enabled" | "disabled" | "not_set";
  /**
   * The enablement status of Automatic dependency submission
   */
  dependency_graph_autosubmit_action?: "enabled" | "disabled" | "not_set";
  /**
   * Feature options for Automatic dependency submission
   */
  dependency_graph_autosubmit_action_options?: {
    /**
     * Whether to use runners labeled with 'dependency-submission' or standard GitHub runners.
     */
    labeled_runners?: boolean;
  };
  /**
   * The enablement status of Dependabot alerts
   */
  dependabot_alerts?: "enabled" | "disabled" | "not_set";
  /**
   * The enablement status of Dependabot security updates
   */
  dependabot_security_updates?: "enabled" | "disabled" | "not_set";
  /**
   * The enablement status of Dependabot delegated alert dismissal
   */
  dependabot_delegated_alert_dismissal?: "enabled" | "disabled" | "not_set";
  /**
   * Feature options for code scanning
   */
  code_scanning_options?: {
    /**
     * Whether to allow repos which use advanced setup
     */
    allow_advanced?: boolean;
  };
  /**
   * The enablement status of code scanning default setup
   */
  code_scanning_default_setup?: "enabled" | "disabled" | "not_set";
  /**
   * Feature options for code scanning default setup
   */
  code_scanning_default_setup_options?: {
    /**
     * Whether to use labeled runners or standard GitHub runners.
     */
    runner_type?: "standard" | "labeled" | "not_set";
    /**
     * The label of the runner to use for code scanning when runner_type is 'labeled'.
     */
    runner_label?: string;
  };
  /**
   * The enablement status of code scanning delegated alert dismissal
   */
  code_scanning_delegated_alert_dismissal?: "enabled" | "disabled" | "not_set";
  /**
   * The enablement status of secret scanning
   */
  secret_scanning?: "enabled" | "disabled" | "not_set";
  /**
   * The enablement status of secret scanning push protection
   */
  secret_scanning_push_protection?: "enabled" | "disabled" | "not_set";
  /**
   * The enablement status of secret scanning delegated bypass
   */
  secret_scanning_delegated_bypass?: "enabled" | "disabled" | "not_set";
  /**
   * Feature options for secret scanning delegated bypass
   */
  secret_scanning_delegated_bypass_options?: {
    /**
     * The bypass reviewers for secret scanning delegated bypass
     */
    reviewers?: Array<{
      /**
       * The ID of the team or role selected as a bypass reviewer
       */
      reviewer_id: number;
      /**
       * The type of the bypass reviewer
       */
      reviewer_type: "TEAM" | "ROLE";
      /**
       * The bypass mode for the reviewer
       * @default "ALWAYS"
       */
      mode?: "ALWAYS" | "EXEMPT";
      /**
       * The ID of the security configuration associated with this bypass reviewer
       */
      security_configuration_id?: number;
    }>;
  };
  /**
   * The enablement status of secret scanning validity checks
   */
  secret_scanning_validity_checks?: "enabled" | "disabled" | "not_set";
  /**
   * The enablement status of secret scanning non-provider patterns
   */
  secret_scanning_non_provider_patterns?: "enabled" | "disabled" | "not_set";
  /**
   * The enablement status of Copilot secret scanning
   */
  secret_scanning_generic_secrets?: "enabled" | "disabled" | "not_set";
  /**
   * The enablement status of secret scanning delegated alert dismissal
   */
  secret_scanning_delegated_alert_dismissal?:
    | "enabled"
    | "disabled"
    | "not_set";
  /**
   * The enablement status of secret scanning extended metadata
   */
  secret_scanning_extended_metadata?: "enabled" | "disabled" | "not_set";
  /**
   * The enablement status of private vulnerability reporting
   */
  private_vulnerability_reporting?: "enabled" | "disabled" | "not_set";
  /**
   * The enforcement status for a security configuration
   */
  enforcement?: "enforced" | "unenforced";
  /**
   * The URL of the configuration
   * @format uri
   */
  url?: string;
  /**
   * The URL of the configuration
   * @format uri
   */
  html_url?: string;
  /**
   * @format date-time
   */
  created_at?: string;
  /**
   * @format date-time
   */
  updated_at?: string;
};
