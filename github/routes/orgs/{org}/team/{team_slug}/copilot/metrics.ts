import type { copilotCopilotMetricsForTeam } from "../../../../../../types/paths/orgs/{org}/team/{team_slug}/copilot/metrics.types.js";

export const GET: copilotCopilotMetricsForTeam = async ($) => {
  return $.response[200].random();
};
