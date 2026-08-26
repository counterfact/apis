import type { getToken } from "../../../../types/paths/api/v2/tokens/{id}.types.js";
import type { patchToken } from "../../../../types/paths/api/v2/tokens/{id}.types.js";
import type { deleteToken } from "../../../../types/paths/api/v2/tokens/{id}.types.js";

export const GET: getToken = async ($) => {
  return $.response[200].random();
};

export const PATCH: patchToken = async ($) => {
  return $.response[200].random();
};

export const DELETE: deleteToken = async ($) => {
  return $.response[204].empty();
};
