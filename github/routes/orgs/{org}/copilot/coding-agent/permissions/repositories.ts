import type { copilotListCopilotCodingAgentSelectedRepositoriesForOrganization } from "../../../../../../types/paths/orgs/{org}/copilot/coding-agent/permissions/repositories.types.js";
import type { copilotSetCopilotCodingAgentSelectedRepositoriesForOrganization } from "../../../../../../types/paths/orgs/{org}/copilot/coding-agent/permissions/repositories.types.js";

export const GET: copilotListCopilotCodingAgentSelectedRepositoriesForOrganization =
  async ($) => {
    return $.response[200].random();
  };

export const PUT: copilotSetCopilotCodingAgentSelectedRepositoriesForOrganization =
  async ($) => {
    return $.response[204].empty();
  };
