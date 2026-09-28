import type { updateBigSegmentContextTargets } from "../../../../../../../types/paths/api/v2/segments/{projectKey}/{environmentKey}/{segmentKey}/contexts.types.js";

export const POST: updateBigSegmentContextTargets = async ($) => {
  return $.response[204].empty();
};
