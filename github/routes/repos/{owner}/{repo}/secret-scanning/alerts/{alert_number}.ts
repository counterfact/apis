import type { secretScanningGetAlert } from "../../../../../../types/paths/repos/{owner}/{repo}/secret-scanning/alerts/{alert_number}.types.js";
import type { secretScanningUpdateAlert } from "../../../../../../types/paths/repos/{owner}/{repo}/secret-scanning/alerts/{alert_number}.types.js";

export const GET: secretScanningGetAlert = async ($) => {
  return $.response[200].random();
};

export const PATCH: secretScanningUpdateAlert = async ($) => {
  return $.response[200].random();
};
