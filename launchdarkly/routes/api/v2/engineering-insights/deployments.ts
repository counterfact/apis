import type { getDeployments } from "../../../../types/paths/api/v2/engineering-insights/deployments.types.js";

export const GET: getDeployments = async ($) => {
  return $.response[200].random();
};
