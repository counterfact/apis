import type { actionsListSelfHostedRunnersForRepo } from "../../../../../types/paths/repos/{owner}/{repo}/actions/runners.types.js";

export const GET: actionsListSelfHostedRunnersForRepo = async ($) => {
  return $.response[200].random();
};
