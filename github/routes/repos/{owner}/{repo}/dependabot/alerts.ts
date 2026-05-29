import type { dependabotListAlertsForRepo } from "../../../../../types/paths/repos/{owner}/{repo}/dependabot/alerts.types.js";

export const GET: dependabotListAlertsForRepo = async ($) => {
  return $.response[200].random();
};
