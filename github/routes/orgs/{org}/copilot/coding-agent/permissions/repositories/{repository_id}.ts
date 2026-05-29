import type { copilotEnableCopilotCodingAgentForRepositoryInOrganization } from "../../../../../../../types/paths/orgs/{org}/copilot/coding-agent/permissions/repositories/{repository_id}.types.js";
import type { copilotDisableCopilotCodingAgentForRepositoryInOrganization } from "../../../../../../../types/paths/orgs/{org}/copilot/coding-agent/permissions/repositories/{repository_id}.types.js";

export const PUT: copilotEnableCopilotCodingAgentForRepositoryInOrganization =
  async ($) => {
    return $.response[204].empty();
  };

export const DELETE: copilotDisableCopilotCodingAgentForRepositoryInOrganization =
  async ($) => {
    return $.response[204].empty();
  };
