import type { getSegmentMembershipForContext } from "../../../../../../../../types/paths/api/v2/segments/{projectKey}/{environmentKey}/{segmentKey}/contexts/{contextKey}.types.js";

export const GET: getSegmentMembershipForContext = async ($) => {
  return $.response[200].random();
};
