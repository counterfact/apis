import type { copilotGetCopilotOrganizationDetails } from "../../../../types/paths/orgs/{org}/copilot/billing.types.js";

export const GET: copilotGetCopilotOrganizationDetails = async ($) => {
  return $.response[200].random();
};
