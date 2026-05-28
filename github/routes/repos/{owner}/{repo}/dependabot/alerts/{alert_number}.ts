import type { dependabotGetAlert } from "../../../../../../types/paths/repos/{owner}/{repo}/dependabot/alerts/{alert_number}.types.js";
import type { dependabotUpdateAlert } from "../../../../../../types/paths/repos/{owner}/{repo}/dependabot/alerts/{alert_number}.types.js";

export const GET: dependabotGetAlert = async ($) => {
  return $.response[200].random();
};

export const PATCH: dependabotUpdateAlert = async ($) => {
  return $.response[200].random();
};
