import type { actionsGenerateRunnerJitconfigForRepo } from "../../../../../../types/paths/repos/{owner}/{repo}/actions/runners/generate-jitconfig.types.js";

export const POST: actionsGenerateRunnerJitconfigForRepo = async ($) => {
  return $.response[201].empty();
};
