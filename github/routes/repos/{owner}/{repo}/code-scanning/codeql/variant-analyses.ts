import type { codeScanningCreateVariantAnalysis } from "../../../../../../types/paths/repos/{owner}/{repo}/code-scanning/codeql/variant-analyses.types.js";

export const POST: codeScanningCreateVariantAnalysis = async ($) => {
  return $.response[201].random();
};
