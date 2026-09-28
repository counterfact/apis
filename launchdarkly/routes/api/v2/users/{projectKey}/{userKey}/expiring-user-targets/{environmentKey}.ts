import type { getExpiringFlagsForUser } from "../../../../../../../types/paths/api/v2/users/{projectKey}/{userKey}/expiring-user-targets/{environmentKey}.types.js";
import type { patchExpiringFlagsForUser } from "../../../../../../../types/paths/api/v2/users/{projectKey}/{userKey}/expiring-user-targets/{environmentKey}.types.js";

export const GET: getExpiringFlagsForUser = async ($) => {
  return $.response[200].random();
};

export const PATCH: patchExpiringFlagsForUser = async ($) => {
  return $.response[200].random();
};
