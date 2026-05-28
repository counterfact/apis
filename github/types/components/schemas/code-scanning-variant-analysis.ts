import type { simple_repository } from "./simple-repository.js";
import type { simple_user } from "./simple-user.js";
import type { code_scanning_variant_analysis_language } from "./code-scanning-variant-analysis-language.js";
import type { code_scanning_variant_analysis_repository } from "./code-scanning-variant-analysis-repository.js";
import type { code_scanning_variant_analysis_status } from "./code-scanning-variant-analysis-status.js";
import type { code_scanning_variant_analysis_skipped_repo_group } from "./code-scanning-variant-analysis-skipped-repo-group.js";

/**
 * A run of a CodeQL query against one or more repositories.
 */
export type code_scanning_variant_analysis = {
  /**
   * The ID of the variant analysis.
   */
  id: number;
  controller_repo: simple_repository;
  actor: simple_user;
  query_language: code_scanning_variant_analysis_language;
  /**
   * The download url for the query pack.
   */
  query_pack_url: string;
  /**
   * The date and time at which the variant analysis was created, in ISO 8601 format':' YYYY-MM-DDTHH:MM:SSZ.
   * @format date-time
   */
  created_at?: string;
  /**
   * The date and time at which the variant analysis was last updated, in ISO 8601 format':' YYYY-MM-DDTHH:MM:SSZ.
   * @format date-time
   */
  updated_at?: string;
  /**
   * The date and time at which the variant analysis was completed, in ISO 8601 format':' YYYY-MM-DDTHH:MM:SSZ. Will be null if the variant analysis has not yet completed or this information is not available.
   * @format date-time
   */
  completed_at?: string;
  status: "in_progress" | "succeeded" | "failed" | "cancelled";
  /**
   * The GitHub Actions workflow run used to execute this variant analysis. This is only available if the workflow run has started.
   */
  actions_workflow_run_id?: number;
  /**
   * The reason for a failure of the variant analysis. This is only available if the variant analysis has failed.
   */
  failure_reason?:
    | "no_repos_queried"
    | "actions_workflow_run_failed"
    | "internal_error";
  scanned_repositories?: Array<{
    repository: code_scanning_variant_analysis_repository;
    analysis_status: code_scanning_variant_analysis_status;
    /**
     * The number of results in the case of a successful analysis. This is only available for successful analyses.
     */
    result_count?: number;
    /**
     * The size of the artifact. This is only available for successful analyses.
     */
    artifact_size_in_bytes?: number;
    /**
     * The reason of the failure of this repo task. This is only available if the repository task has failed.
     */
    failure_message?: string;
  }>;
  /**
   * Information about repositories that were skipped from processing. This information is only available to the user that initiated the variant analysis.
   */
  skipped_repositories?: {
    access_mismatch_repos: code_scanning_variant_analysis_skipped_repo_group;
    not_found_repos: {
      /**
       * The total number of repositories that were skipped for this reason.
       * @example 2
       */
      repository_count: number;
      /**
       * A list of full repository names that were skipped. This list may not include all repositories that were skipped.
       */
      repository_full_names: Array<string>;
    };
    no_codeql_db_repos: code_scanning_variant_analysis_skipped_repo_group;
    over_limit_repos: code_scanning_variant_analysis_skipped_repo_group;
  };
};
