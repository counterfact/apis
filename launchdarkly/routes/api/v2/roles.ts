import type { getCustomRoles } from "../../../types/paths/api/v2/roles.types.js";
import type { postCustomRole } from "../../../types/paths/api/v2/roles.types.js";

export const GET: getCustomRoles = async ($) => {
  return $.response[200].random();
};

export const POST: postCustomRole = async ($) => {
  return $.response[201].random();
};
