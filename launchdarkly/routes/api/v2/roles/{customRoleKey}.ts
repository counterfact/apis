import type { getCustomRole } from "../../../../types/paths/api/v2/roles/{customRoleKey}.types.js";
import type { patchCustomRole } from "../../../../types/paths/api/v2/roles/{customRoleKey}.types.js";
import type { deleteCustomRole } from "../../../../types/paths/api/v2/roles/{customRoleKey}.types.js";

export const GET: getCustomRole = async ($) => {
  return $.response[200].random();
};

export const PATCH: patchCustomRole = async ($) => {
  return $.response[200].random();
};

export const DELETE: deleteCustomRole = async ($) => {
  return $.response[204].empty();
};
