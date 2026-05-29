import type { secretScanningGetScanHistory } from "../../../../../types/paths/repos/{owner}/{repo}/secret-scanning/scan-history.types.js";

export const GET: secretScanningGetScanHistory = async ($) => {
  return $.response[200].random();
};
