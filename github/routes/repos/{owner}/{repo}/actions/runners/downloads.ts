import type { actionsListRunnerApplicationsForRepo } from "../../../../../../types/paths/repos/{owner}/{repo}/actions/runners/downloads.types.js";

export const GET: actionsListRunnerApplicationsForRepo = async ($) => {
  return $.response[200].random();
};
