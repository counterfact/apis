import type { createDeploymentEvent } from "../../../../types/paths/api/v2/engineering-insights/deployment-events.types.js";

export const POST: createDeploymentEvent = async ($) => {
  return $.response[201].empty();
};
