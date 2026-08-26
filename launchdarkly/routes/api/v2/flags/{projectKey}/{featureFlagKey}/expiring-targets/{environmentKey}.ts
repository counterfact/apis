import type { getExpiringContextTargets } from "../../../../../../../types/paths/api/v2/flags/{projectKey}/{featureFlagKey}/expiring-targets/{environmentKey}.types.js";
import type { patchExpiringTargets } from "../../../../../../../types/paths/api/v2/flags/{projectKey}/{featureFlagKey}/expiring-targets/{environmentKey}.types.js";

export const GET: getExpiringContextTargets = async ($) => {
  return $.response[200].random();
};

export const PATCH: patchExpiringTargets = async ($) => {
  return $.response[200].random();
};
