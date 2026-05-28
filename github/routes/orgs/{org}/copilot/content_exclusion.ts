import type { copilotCopilotContentExclusionForOrganization } from "../../../../types/paths/orgs/{org}/copilot/content_exclusion.types.js";
import type { copilotSetCopilotContentExclusionForOrganization } from "../../../../types/paths/orgs/{org}/copilot/content_exclusion.types.js";

export const GET: copilotCopilotContentExclusionForOrganization = async ($) => {
  return $.response[200].random();
};

export const PUT: copilotSetCopilotContentExclusionForOrganization = async (
  $,
) => {
  return $.response[200].random();
};
