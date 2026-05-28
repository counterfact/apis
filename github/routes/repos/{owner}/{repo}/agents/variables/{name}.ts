import type { agentsGetRepoVariable } from "../../../../../../types/paths/repos/{owner}/{repo}/agents/variables/{name}.types.js";
import type { agentsUpdateRepoVariable } from "../../../../../../types/paths/repos/{owner}/{repo}/agents/variables/{name}.types.js";
import type { agentsDeleteRepoVariable } from "../../../../../../types/paths/repos/{owner}/{repo}/agents/variables/{name}.types.js";

export const GET: agentsGetRepoVariable = async ($) => {
  return $.response[200].random();
};

export const PATCH: agentsUpdateRepoVariable = async ($) => {
  return $.response[204].empty();
};

export const DELETE: agentsDeleteRepoVariable = async ($) => {
  return $.response[204].empty();
};
