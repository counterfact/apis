import type { codeScanningGetVariantAnalysisRepoTask } from "../../../../../../../../../../types/paths/repos/{owner}/{repo}/code-scanning/codeql/variant-analyses/{codeql_variant_analysis_id}/repos/{repo_owner}/{repo_name}.types.js";

export const GET: codeScanningGetVariantAnalysisRepoTask = async ($) => {
  return $.response[200].random();
};
