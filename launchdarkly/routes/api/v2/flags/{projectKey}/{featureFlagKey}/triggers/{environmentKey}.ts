import type { getTriggerWorkflows } from "../../../../../../../types/paths/api/v2/flags/{projectKey}/{featureFlagKey}/triggers/{environmentKey}.types.js";
import type { createTriggerWorkflow } from "../../../../../../../types/paths/api/v2/flags/{projectKey}/{featureFlagKey}/triggers/{environmentKey}.types.js";

export const GET: getTriggerWorkflows = async ($) => {
  return $.response[200].random();
};

export const POST: createTriggerWorkflow = async ($) => {
  return $.response[201].random();
};
