import type { codeScanningListAlertsForRepo } from "../../../../../types/paths/repos/{owner}/{repo}/code-scanning/alerts.types.js";

export const GET: codeScanningListAlertsForRepo = async ($) => {
  return $.response[200].random();
};
