export type security_and_analysis = {
  /**
   * Enable or disable GitHub Advanced Security for the repository.
   *
   * For standalone Code Scanning or Secret Protection products, this parameter cannot be used.
   *
   */
  advanced_security?: { status?: "enabled" | "disabled" };
  code_security?: { status?: "enabled" | "disabled" };
  /**
   * Enable or disable Dependabot security updates for the repository.
   */
  dependabot_security_updates?: {
    /**
     * The enablement status of Dependabot security updates for the repository.
     */
    status?: "enabled" | "disabled";
  };
  secret_scanning?: { status?: "enabled" | "disabled" };
  secret_scanning_push_protection?: { status?: "enabled" | "disabled" };
  secret_scanning_non_provider_patterns?: { status?: "enabled" | "disabled" };
  secret_scanning_ai_detection?: { status?: "enabled" | "disabled" };
  secret_scanning_delegated_alert_dismissal?: {
    status?: "enabled" | "disabled";
  };
  secret_scanning_delegated_bypass?: { status?: "enabled" | "disabled" };
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
    }>;
  };
};
