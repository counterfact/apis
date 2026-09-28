import type { getTriggerWorkflowById } from "../../../../../../../../types/paths/api/v2/flags/{projectKey}/{featureFlagKey}/triggers/{environmentKey}/{id}.types.js";
import type { patchTriggerWorkflow } from "../../../../../../../../types/paths/api/v2/flags/{projectKey}/{featureFlagKey}/triggers/{environmentKey}/{id}.types.js";
import type { deleteTriggerWorkflow } from "../../../../../../../../types/paths/api/v2/flags/{projectKey}/{featureFlagKey}/triggers/{environmentKey}/{id}.types.js";

export const GET: getTriggerWorkflowById = async ($) => {
  return $.response[200].random();
};

export const PATCH: patchTriggerWorkflow = async ($) => {
  return $.response[200].random();
};

export const DELETE: deleteTriggerWorkflow = async ($) => {
  return $.response[204].empty();
};
