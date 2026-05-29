export type code_scanning_alert_rule_summary = {
  /**
   * A unique identifier for the rule used to detect the alert.
   */
  id?: string;
  /**
   * The name of the rule used to detect the alert.
   */
  name?: string;
  /**
   * The severity of the alert.
   */
  severity?: "none" | "note" | "warning" | "error";
  /**
   * The security severity of the alert.
   */
  security_severity_level?: "low" | "medium" | "high" | "critical";
  /**
   * A short description of the rule used to detect the alert.
   */
  description?: string;
  /**
   * A description of the rule used to detect the alert.
   */
  full_description?: string;
  /**
   * A set of tags applicable for the rule.
   */
  tags?: Array<string>;
  /**
   * Detailed documentation for the rule as GitHub Flavored Markdown.
   */
  help?: string;
  /**
   * A link to the documentation for the rule used to detect the alert.
   */
  help_uri?: string;
};
