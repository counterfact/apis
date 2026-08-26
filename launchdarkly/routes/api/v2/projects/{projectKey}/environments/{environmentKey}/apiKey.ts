import type { resetEnvironmentSDKKey } from "../../../../../../../types/paths/api/v2/projects/{projectKey}/environments/{environmentKey}/apiKey.types.js";

export const POST: resetEnvironmentSDKKey = async ($) => {
  return $.response[200].random();
};
