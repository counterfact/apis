import type { issuesGetLabel } from "../../../../../types/paths/repos/{owner}/{repo}/labels/{name}.types.js";
import type { issuesUpdateLabel } from "../../../../../types/paths/repos/{owner}/{repo}/labels/{name}.types.js";
import type { issuesDeleteLabel } from "../../../../../types/paths/repos/{owner}/{repo}/labels/{name}.types.js";

export const GET: issuesGetLabel = async ($) => {
  return $.response[200].random();
};

export const PATCH: issuesUpdateLabel = async ($) => {
  return $.response[200].random();
};

export const DELETE: issuesDeleteLabel = async ($) => {
  return $.response[204].empty();
};
