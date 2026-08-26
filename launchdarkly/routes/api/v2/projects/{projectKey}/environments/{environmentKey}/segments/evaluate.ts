import type { getContextInstanceSegmentsMembershipByEnv } from "../../../../../../../../types/paths/api/v2/projects/{projectKey}/environments/{environmentKey}/segments/evaluate.types.js";

export const POST: getContextInstanceSegmentsMembershipByEnv = async ($) => {
  return $.response[200].random();
};
