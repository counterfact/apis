import type { getExpiringUserTargets } from "../../../../../../../types/paths/api/v2/flags/{projectKey}/{featureFlagKey}/expiring-user-targets/{environmentKey}.types.js";
import type { patchExpiringUserTargets } from "../../../../../../../types/paths/api/v2/flags/{projectKey}/{featureFlagKey}/expiring-user-targets/{environmentKey}.types.js";

export const GET: getExpiringUserTargets = async ($) => {
  return $.response[200].random();
};

export const PATCH: patchExpiringUserTargets = async ($) => {
  return $.response[200].random();
};
