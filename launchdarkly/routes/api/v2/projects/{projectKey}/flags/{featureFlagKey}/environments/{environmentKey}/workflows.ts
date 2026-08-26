import type { getWorkflows } from "../../../../../../../../../types/paths/api/v2/projects/{projectKey}/flags/{featureFlagKey}/environments/{environmentKey}/workflows.types.js";
import type { postWorkflow } from "../../../../../../../../../types/paths/api/v2/projects/{projectKey}/flags/{featureFlagKey}/environments/{environmentKey}/workflows.types.js";

export const GET: getWorkflows = async ($) => {
  return $.response[200].random();
};

export const POST: postWorkflow = async ($) => {
  return $.response[201].random();
};
