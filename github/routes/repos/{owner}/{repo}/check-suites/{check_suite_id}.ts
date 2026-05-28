import type { checksGetSuite } from "../../../../../types/paths/repos/{owner}/{repo}/check-suites/{check_suite_id}.types.js";

export const GET: checksGetSuite = async ($) => {
  return $.response[200].random();
};
