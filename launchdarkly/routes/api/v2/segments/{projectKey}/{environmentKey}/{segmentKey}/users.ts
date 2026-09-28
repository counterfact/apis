import type { updateBigSegmentTargets } from "../../../../../../../types/paths/api/v2/segments/{projectKey}/{environmentKey}/{segmentKey}/users.types.js";

export const POST: updateBigSegmentTargets = async ($) => {
  return $.response[204].empty();
};
