import type { codeScanningGetAutofix } from "../../../../../../../types/paths/repos/{owner}/{repo}/code-scanning/alerts/{alert_number}/autofix.types.js";
import type { codeScanningCreateAutofix } from "../../../../../../../types/paths/repos/{owner}/{repo}/code-scanning/alerts/{alert_number}/autofix.types.js";

export const GET: codeScanningGetAutofix = async ($) => {
  return $.response[200].random();
};

export const POST: codeScanningCreateAutofix = async ($) => {
  return $.response[200].random();
};
