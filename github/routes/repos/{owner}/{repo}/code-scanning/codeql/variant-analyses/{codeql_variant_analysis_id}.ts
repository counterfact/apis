import type { codeScanningGetVariantAnalysis } from "../../../../../../../types/paths/repos/{owner}/{repo}/code-scanning/codeql/variant-analyses/{codeql_variant_analysis_id}.types.js";

export const GET: codeScanningGetVariantAnalysis = async ($) => {
  return $.response[200].random();
};
