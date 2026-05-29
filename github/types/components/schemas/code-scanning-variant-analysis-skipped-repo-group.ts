import type { code_scanning_variant_analysis_repository } from "./code-scanning-variant-analysis-repository.js";

export type code_scanning_variant_analysis_skipped_repo_group = {
  /**
   * The total number of repositories that were skipped for this reason.
   * @example 2
   */
  repository_count: number;
  /**
   * A list of repositories that were skipped. This list may not include all repositories that were skipped. This is only available when the repository was found and the user has access to it.
   */
  repositories: Array<code_scanning_variant_analysis_repository>;
};
