import type { codeScanningListRecentAnalyses } from "../../../../../types/paths/repos/{owner}/{repo}/code-scanning/analyses.types.js";

export const GET: codeScanningListRecentAnalyses = async ($) => {
  return $.response[200].random();
};
