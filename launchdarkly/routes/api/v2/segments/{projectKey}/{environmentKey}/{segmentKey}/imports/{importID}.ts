import type { getBigSegmentImport } from "../../../../../../../../types/paths/api/v2/segments/{projectKey}/{environmentKey}/{segmentKey}/imports/{importID}.types.js";

export const GET: getBigSegmentImport = async ($) => {
  return $.response[200].random();
};
