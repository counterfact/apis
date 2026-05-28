import type { codeScanningGetAnalysis } from "../../../../../../types/paths/repos/{owner}/{repo}/code-scanning/analyses/{analysis_id}.types.js";
import type { codeScanningDeleteAnalysis } from "../../../../../../types/paths/repos/{owner}/{repo}/code-scanning/analyses/{analysis_id}.types.js";

export const GET: codeScanningGetAnalysis = async ($) => {
  return $.response[200].random();
};

export const DELETE: codeScanningDeleteAnalysis = async ($) => {
  return $.response[200].random();
};
