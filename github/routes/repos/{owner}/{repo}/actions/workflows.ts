import type { actionsListRepoWorkflows } from "../../../../../types/paths/repos/{owner}/{repo}/actions/workflows.types.js";

export const GET: actionsListRepoWorkflows = async ($) => {
  return $.response[200].random();
};
