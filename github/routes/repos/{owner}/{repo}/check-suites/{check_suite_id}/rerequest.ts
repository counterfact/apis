import type { checksRerequestSuite } from "../../../../../../types/paths/repos/{owner}/{repo}/check-suites/{check_suite_id}/rerequest.types.js";

export const POST: checksRerequestSuite = async ($) => {
  return $.response[201].random();
};
