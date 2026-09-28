import type { getCustomWorkflow } from "../../../../../../../../../../types/paths/api/v2/projects/{projectKey}/flags/{featureFlagKey}/environments/{environmentKey}/workflows/{workflowId}.types.js";
import type { deleteWorkflow } from "../../../../../../../../../../types/paths/api/v2/projects/{projectKey}/flags/{featureFlagKey}/environments/{environmentKey}/workflows/{workflowId}.types.js";

export const GET: getCustomWorkflow = async ($) => {
  return $.response[200].random();
};

export const DELETE: deleteWorkflow = async ($) => {
  return $.response[204].empty();
};
