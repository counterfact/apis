import type { secretScanningListAlertsForOrg } from "../../../../types/paths/orgs/{org}/secret-scanning/alerts.types.js";

export const GET: secretScanningListAlertsForOrg = async ($) => {
  return $.response[200].random();
};
