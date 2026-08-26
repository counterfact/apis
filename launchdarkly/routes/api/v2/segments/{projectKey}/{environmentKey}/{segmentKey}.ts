import type { getSegment } from "../../../../../../types/paths/api/v2/segments/{projectKey}/{environmentKey}/{segmentKey}.types.js";
import type { patchSegment } from "../../../../../../types/paths/api/v2/segments/{projectKey}/{environmentKey}/{segmentKey}.types.js";
import type { deleteSegment } from "../../../../../../types/paths/api/v2/segments/{projectKey}/{environmentKey}/{segmentKey}.types.js";

export const GET: getSegment = async ($) => {
  return $.response[200].random();
};

export const PATCH: patchSegment = async ($) => {
  return $.response[200].random();
};

export const DELETE: deleteSegment = async ($) => {
  return $.response[204].empty();
};
