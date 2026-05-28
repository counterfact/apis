import type { copilotCopilotMetricsForOrganization } from "../../../../types/paths/orgs/{org}/copilot/metrics.types.js";

export const GET: copilotCopilotMetricsForOrganization = async ($) => {
  return $.response[200].random();
};
