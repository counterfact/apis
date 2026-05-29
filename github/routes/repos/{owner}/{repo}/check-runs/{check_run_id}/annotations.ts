import type { checksListAnnotations } from "../../../../../../types/paths/repos/{owner}/{repo}/check-runs/{check_run_id}/annotations.types.js";

export const GET: checksListAnnotations = async ($) => {
  return $.response[200].random();
};
