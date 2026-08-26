import type { getExpiringUserTargetsForSegment } from "../../../../../../../types/paths/api/v2/segments/{projectKey}/{segmentKey}/expiring-user-targets/{environmentKey}.types.js";
import type { patchExpiringUserTargetsForSegment } from "../../../../../../../types/paths/api/v2/segments/{projectKey}/{segmentKey}/expiring-user-targets/{environmentKey}.types.js";

export const GET: getExpiringUserTargetsForSegment = async ($) => {
  return $.response[200].random();
};

export const PATCH: patchExpiringUserTargetsForSegment = async ($) => {
  return $.response[200].random();
};
