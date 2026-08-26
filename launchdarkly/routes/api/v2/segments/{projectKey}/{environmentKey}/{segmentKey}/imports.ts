import type { createBigSegmentImport } from "../../../../../../../types/paths/api/v2/segments/{projectKey}/{environmentKey}/{segmentKey}/imports.types.js";

export const POST: createBigSegmentImport = async ($) => {
  return $.response[204].empty();
};
