import type { codeScanningListAlertInstances } from "../../../../../../../types/paths/repos/{owner}/{repo}/code-scanning/alerts/{alert_number}/instances.types.js";

export const GET: codeScanningListAlertInstances = async ($) => {
  return $.response[200].random();
};
