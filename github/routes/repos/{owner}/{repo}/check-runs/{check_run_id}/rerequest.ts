import type { checksRerequestRun } from "../../../../../../types/paths/repos/{owner}/{repo}/check-runs/{check_run_id}/rerequest.types.js";

export const POST: checksRerequestRun = async ($) => {
  return $.response[201].random();
};
