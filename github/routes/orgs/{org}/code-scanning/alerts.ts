import type { codeScanningListAlertsForOrg } from "../../../../types/paths/orgs/{org}/code-scanning/alerts.types.js";

export const GET: codeScanningListAlertsForOrg = async ($) => {
  return $.response[200].random();
};
