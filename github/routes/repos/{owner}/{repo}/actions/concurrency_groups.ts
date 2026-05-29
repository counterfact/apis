import type { actionsListConcurrencyGroupsForRepository } from "../../../../../types/paths/repos/{owner}/{repo}/actions/concurrency_groups.types.js";

export const GET: actionsListConcurrencyGroupsForRepository = async ($) => {
  return $.response[200].random();
};
