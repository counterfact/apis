import type { secretScanningListLocationsForAlert } from "../../../../../../../types/paths/repos/{owner}/{repo}/secret-scanning/alerts/{alert_number}/locations.types.js";

export const GET: secretScanningListLocationsForAlert = async ($) => {
  return $.response[200].random();
};
