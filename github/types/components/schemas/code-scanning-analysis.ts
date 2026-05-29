import type { code_scanning_ref } from "./code-scanning-ref.js";
import type { code_scanning_analysis_commit_sha } from "./code-scanning-analysis-commit-sha.js";
import type { code_scanning_analysis_analysis_key } from "./code-scanning-analysis-analysis-key.js";
import type { code_scanning_analysis_environment } from "./code-scanning-analysis-environment.js";
import type { code_scanning_analysis_category } from "./code-scanning-analysis-category.js";
import type { code_scanning_analysis_created_at } from "./code-scanning-analysis-created-at.js";
import type { code_scanning_analysis_url } from "./code-scanning-analysis-url.js";
import type { code_scanning_analysis_sarif_id } from "./code-scanning-analysis-sarif-id.js";
import type { code_scanning_analysis_tool } from "./code-scanning-analysis-tool.js";

export type code_scanning_analysis = {
  ref: code_scanning_ref;
  commit_sha: code_scanning_analysis_commit_sha;
  analysis_key: code_scanning_analysis_analysis_key;
  environment: code_scanning_analysis_environment;
  category?: code_scanning_analysis_category;
  /**
   * @example "error reading field xyz"
   */
  error: string;
  created_at: code_scanning_analysis_created_at;
  /**
   * The total number of results in the analysis.
   */
  results_count: number;
  /**
   * The total number of rules used in the analysis.
   */
  rules_count: number;
  /**
   * Unique identifier for this analysis.
   */
  id: number;
  url: code_scanning_analysis_url;
  sarif_id: code_scanning_analysis_sarif_id;
  tool: code_scanning_analysis_tool;
  deletable: boolean;
  /**
   * Warning generated when processing the analysis
   * @example "123 results were ignored"
   */
  warning: string;
};
