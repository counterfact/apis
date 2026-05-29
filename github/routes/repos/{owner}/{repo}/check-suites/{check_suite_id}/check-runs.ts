import type { checksListForSuite } from "../../../../../../types/paths/repos/{owner}/{repo}/check-suites/{check_suite_id}/check-runs.types.js";

export const GET: checksListForSuite = async ($) => {
  return $.response[200].random();
};
