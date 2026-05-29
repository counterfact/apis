import type { copilotGetCopilotCloudAgentConfiguration } from "../../../../../../types/paths/repos/{owner}/{repo}/copilot/cloud-agent/configuration.types.js";

export const GET: copilotGetCopilotCloudAgentConfiguration = async ($) => {
  return $.response[200].random();
};
