import type { dependabotListAlertsForEnterprise } from "../../../../types/paths/enterprises/{enterprise}/dependabot/alerts.types.js";

export const GET: dependabotListAlertsForEnterprise = async ($) => {
  return $.response[200].random();
};
