import type { usersGetGpgKeyForAuthenticatedUser } from "../../../types/paths/user/gpg_keys/{gpg_key_id}.types.js";
import type { usersDeleteGpgKeyForAuthenticatedUser } from "../../../types/paths/user/gpg_keys/{gpg_key_id}.types.js";

export const GET: usersGetGpgKeyForAuthenticatedUser = async ($) => {
  return $.response[200].random();
};

export const DELETE: usersDeleteGpgKeyForAuthenticatedUser = async ($) => {
  return $.response[204].empty();
};
