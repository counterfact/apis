import type { secretScanningListAlertsForRepo } from "../../../../../types/paths/repos/{owner}/{repo}/secret-scanning/alerts.types.js";

export const GET: secretScanningListAlertsForRepo = async ($) => {
  return $.response[200].random();
};
