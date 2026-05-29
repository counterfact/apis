import type { copilotCopilotOrganizationUsersOneDayUsageMetrics } from "../../../../../../types/paths/orgs/{org}/copilot/metrics/reports/users-1-day.types.js";

export const GET: copilotCopilotOrganizationUsersOneDayUsageMetrics = async (
  $,
) => {
  return $.response[200].random();
};
