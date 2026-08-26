import type { getMember } from "../../../../types/paths/api/v2/members/{id}.types.js";
import type { patchMember } from "../../../../types/paths/api/v2/members/{id}.types.js";
import type { deleteMember } from "../../../../types/paths/api/v2/members/{id}.types.js";

export const GET: getMember = async ($) => {
  return $.response[200].random();
};

export const PATCH: patchMember = async ($) => {
  return $.response[200].random();
};

export const DELETE: deleteMember = async ($) => {
  return $.response[204].empty();
};
