import type { actionsGenerateRunnerJitconfigForOrg } from "../../../../../types/paths/orgs/{org}/actions/runners/generate-jitconfig.types.js";

export const POST: actionsGenerateRunnerJitconfigForOrg = async ($) => {
  return $.response[201].empty();
};
