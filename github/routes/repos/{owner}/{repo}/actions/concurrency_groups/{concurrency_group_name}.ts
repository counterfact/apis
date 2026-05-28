import type { actionsGetConcurrencyGroupForRepository } from "../../../../../../types/paths/repos/{owner}/{repo}/actions/concurrency_groups/{concurrency_group_name}.types.js";

export const GET: actionsGetConcurrencyGroupForRepository = async ($) => {
  return $.response[200].random();
};
