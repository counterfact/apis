import type { code_scanning_ref } from "./code-scanning-ref.js";
import type { code_scanning_analysis_analysis_key } from "./code-scanning-analysis-analysis-key.js";
import type { code_scanning_alert_environment } from "./code-scanning-alert-environment.js";
import type { code_scanning_analysis_category } from "./code-scanning-analysis-category.js";
import type { code_scanning_alert_instance_state } from "./code-scanning-alert-instance-state.js";
import type { code_scanning_alert_location } from "./code-scanning-alert-location.js";
import type { code_scanning_alert_classification } from "./code-scanning-alert-classification.js";

export type code_scanning_alert_instance_list = {
  ref?: code_scanning_ref;
  analysis_key?: code_scanning_analysis_analysis_key;
  environment?: code_scanning_alert_environment;
  category?: code_scanning_analysis_category;
  state?: code_scanning_alert_instance_state;
  commit_sha?: string;
  message?: { text?: string };
  location?: code_scanning_alert_location;
  html_url?: string;
  /**
   * Classifications that have been applied to the file that triggered the alert.
   * For example identifying it as documentation, or a generated file.
   */
  classifications?: Array<code_scanning_alert_classification>;
};
