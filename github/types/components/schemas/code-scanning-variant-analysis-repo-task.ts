import type { simple_repository } from "./simple-repository.js";
import type { code_scanning_variant_analysis_status } from "./code-scanning-variant-analysis-status.js";

export type code_scanning_variant_analysis_repo_task = {
  repository: simple_repository;
  analysis_status: code_scanning_variant_analysis_status;
  /**
   * The size of the artifact. This is only available for successful analyses.
   */
  artifact_size_in_bytes?: number;
  /**
   * The number of results in the case of a successful analysis. This is only available for successful analyses.
   */
  result_count?: number;
  /**
   * The reason of the failure of this repo task. This is only available if the repository task has failed.
   */
  failure_message?: string;
  /**
   * The SHA of the commit the CodeQL database was built against. This is only available for successful analyses.
   */
  database_commit_sha?: string;
  /**
   * The source location prefix to use. This is only available for successful analyses.
   */
  source_location_prefix?: string;
  /**
   * The URL of the artifact. This is only available for successful analyses.
   */
  artifact_url?: string;
};
