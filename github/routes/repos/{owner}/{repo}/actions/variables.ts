import type { actionsListRepoVariables } from "../../../../../types/paths/repos/{owner}/{repo}/actions/variables.types.js";
import type { actionsCreateRepoVariable } from "../../../../../types/paths/repos/{owner}/{repo}/actions/variables.types.js";

export const GET: actionsListRepoVariables = async ($) => {
  return $.response[200].random();
};

export const POST: actionsCreateRepoVariable = async ($) => {
  return $.response[201].random();
};
