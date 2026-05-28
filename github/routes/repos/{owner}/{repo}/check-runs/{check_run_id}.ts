import type { checksGet } from "../../../../../types/paths/repos/{owner}/{repo}/check-runs/{check_run_id}.types.js";
import type { checksUpdate } from "../../../../../types/paths/repos/{owner}/{repo}/check-runs/{check_run_id}.types.js";

export const GET: checksGet = async ($) => {
  return $.response[200].random();
};

export const PATCH: checksUpdate = async ($) => {
  return $.response[200].random();
};
