import type { getSegments } from "../../../../../types/paths/api/v2/segments/{projectKey}/{environmentKey}.types.js";
import type { postSegment } from "../../../../../types/paths/api/v2/segments/{projectKey}/{environmentKey}.types.js";

export const GET: getSegments = async ($) => {
  return $.response[200].random();
};

export const POST: postSegment = async ($) => {
  return $.response[201].random();
};
