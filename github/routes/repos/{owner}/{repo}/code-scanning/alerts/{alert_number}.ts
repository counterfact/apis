import type { codeScanningGetAlert } from "../../../../../../types/paths/repos/{owner}/{repo}/code-scanning/alerts/{alert_number}.types.js";
import type { codeScanningUpdateAlert } from "../../../../../../types/paths/repos/{owner}/{repo}/code-scanning/alerts/{alert_number}.types.js";

export const GET: codeScanningGetAlert = async ($) => {
  return $.response[200].random();
};

export const PATCH: codeScanningUpdateAlert = async ($) => {
  return $.response[200].random();
};
