import type { createBigSegmentExport } from "../../../../../../../types/paths/api/v2/segments/{projectKey}/{environmentKey}/{segmentKey}/exports.types.js";

export const POST: createBigSegmentExport = async ($) => {
  return $.response[200].empty();
};
