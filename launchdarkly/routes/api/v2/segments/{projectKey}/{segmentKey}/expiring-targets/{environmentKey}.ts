import type { getExpiringTargetsForSegment } from "../../../../../../../types/paths/api/v2/segments/{projectKey}/{segmentKey}/expiring-targets/{environmentKey}.types.js";
import type { patchExpiringTargetsForSegment } from "../../../../../../../types/paths/api/v2/segments/{projectKey}/{segmentKey}/expiring-targets/{environmentKey}.types.js";

export const GET: getExpiringTargetsForSegment = async ($) => {
  return $.response[200].random();
};

export const PATCH: patchExpiringTargetsForSegment = async ($) => {
  return $.response[200].random();
};
