import type { copilotGetCopilotCodingAgentPermissionsOrganization } from "../../../../../types/paths/orgs/{org}/copilot/coding-agent/permissions.types.js";
import type { copilotSetCopilotCodingAgentPermissionsOrganization } from "../../../../../types/paths/orgs/{org}/copilot/coding-agent/permissions.types.js";

export const GET: copilotGetCopilotCodingAgentPermissionsOrganization = async (
  $,
) => {
  return $.response[200].random();
};

export const PUT: copilotSetCopilotCodingAgentPermissionsOrganization = async (
  $,
) => {
  return $.response[204].empty();
};
