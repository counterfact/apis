import type { agentsListRepoVariables } from "../../../../../types/paths/repos/{owner}/{repo}/agents/variables.types.js";
import type { agentsCreateRepoVariable } from "../../../../../types/paths/repos/{owner}/{repo}/agents/variables.types.js";

export const GET: agentsListRepoVariables = async ($) => {
  return $.response[200].random();
};

export const POST: agentsCreateRepoVariable = async ($) => {
  return $.response[201].random();
};
