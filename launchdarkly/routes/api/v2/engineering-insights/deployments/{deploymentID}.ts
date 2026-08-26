import type { getDeployment } from "../../../../../types/paths/api/v2/engineering-insights/deployments/{deploymentID}.types.js";
import type { updateDeployment } from "../../../../../types/paths/api/v2/engineering-insights/deployments/{deploymentID}.types.js";

export const GET: getDeployment = async ($) => {
  return $.response[200].random();
};

export const PATCH: updateDeployment = async ($) => {
  return $.response[200].random();
};
