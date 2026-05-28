import type { copilotAddOrganizationsToEnterpriseCodingAgentPolicy } from "../../../../../../types/paths/enterprises/{enterprise}/copilot/policies/coding_agent/organizations.types.js";
import type { copilotRemoveOrganizationsFromEnterpriseCodingAgentPolicy } from "../../../../../../types/paths/enterprises/{enterprise}/copilot/policies/coding_agent/organizations.types.js";

export const POST: copilotAddOrganizationsToEnterpriseCodingAgentPolicy =
  async ($) => {
    return $.response[204].empty();
  };

export const DELETE: copilotRemoveOrganizationsFromEnterpriseCodingAgentPolicy =
  async ($) => {
    return $.response[204].empty();
  };
