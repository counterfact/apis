import type { getBigSegmentExport } from "../../../../../../../../types/paths/api/v2/segments/{projectKey}/{environmentKey}/{segmentKey}/exports/{exportID}.types.js";

export const GET: getBigSegmentExport = async ($) => {
  return $.response[200].random();
};
