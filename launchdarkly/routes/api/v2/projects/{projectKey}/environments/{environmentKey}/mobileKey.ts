import type { resetEnvironmentMobileKey } from "../../../../../../../types/paths/api/v2/projects/{projectKey}/environments/{environmentKey}/mobileKey.types.js";

export const POST: resetEnvironmentMobileKey = async ($) => {
  return $.response[200].random();
};
