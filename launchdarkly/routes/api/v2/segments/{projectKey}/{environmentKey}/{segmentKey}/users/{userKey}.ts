import type { getSegmentMembershipForUser } from "../../../../../../../../types/paths/api/v2/segments/{projectKey}/{environmentKey}/{segmentKey}/users/{userKey}.types.js";

export const GET: getSegmentMembershipForUser = async ($) => {
  return $.response[200].random();
};
