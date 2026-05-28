import type { pullsGet } from "../../../../../types/paths/repos/{owner}/{repo}/pulls/{pull_number}.types.js";
import type { pullsUpdate } from "../../../../../types/paths/repos/{owner}/{repo}/pulls/{pull_number}.types.js";

export const GET: pullsGet = async ($) => {
  return $.response[200].random();
};

export const PATCH: pullsUpdate = async ($) => {
  return $.response[200].random();
};
