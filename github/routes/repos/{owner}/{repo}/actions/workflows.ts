import type { actionsListRepoWorkflows } from "../../../../../types/paths/repos/{owner}/{repo}/actions/workflows.types.js";

export const GET: actionsListRepoWorkflows = async ($) => {
  const workflows = $.context.listWorkflows($.path.owner, $.path.repo, $.query);
  return $.response[200].json({
    total_count: workflows.length,
    workflows,
  });
};
