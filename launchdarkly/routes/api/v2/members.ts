import type { getMembers } from "../../../types/paths/api/v2/members.types.js";
import type { postMembers } from "../../../types/paths/api/v2/members.types.js";
import type { patchMembers } from "../../../types/paths/api/v2/members.types.js";

export const GET: getMembers = async ($) => {
  return $.response[200].random();
};

export const POST: postMembers = async ($) => {
  return $.response[201].random();
};

export const PATCH: patchMembers = async ($) => {
  return $.response[200].random();
};
