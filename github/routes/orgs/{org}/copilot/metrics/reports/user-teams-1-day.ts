import type { copilotCopilotOrganizationUserTeamsOneDayReport } from "../../../../../../types/paths/orgs/{org}/copilot/metrics/reports/user-teams-1-day.types.js";

export const GET: copilotCopilotOrganizationUserTeamsOneDayReport = async (
  $,
) => {
  return $.response[200].random();
};
