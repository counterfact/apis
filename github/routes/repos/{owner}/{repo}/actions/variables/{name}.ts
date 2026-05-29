import type { actionsGetRepoVariable } from "../../../../../../types/paths/repos/{owner}/{repo}/actions/variables/{name}.types.js";
import type { actionsUpdateRepoVariable } from "../../../../../../types/paths/repos/{owner}/{repo}/actions/variables/{name}.types.js";
import type { actionsDeleteRepoVariable } from "../../../../../../types/paths/repos/{owner}/{repo}/actions/variables/{name}.types.js";

export const GET: actionsGetRepoVariable = async ($) => {
  return $.response[200].random();
};

export const PATCH: actionsUpdateRepoVariable = async ($) => {
  return $.response[204].empty();
};

export const DELETE: actionsDeleteRepoVariable = async ($) => {
  return $.response[204].empty();
};
