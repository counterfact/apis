import type { dependabotListAlertsForOrg } from "../../../../types/paths/orgs/{org}/dependabot/alerts.types.js";

export const GET: dependabotListAlertsForOrg = async ($) => {
  return $.response[200].random();
};
