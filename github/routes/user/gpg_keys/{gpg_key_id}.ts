import type { usersGetGpgKeyForAuthenticatedUser } from "../../../types/paths/user/gpg_keys/{gpg_key_id}.types.js";
import type { usersDeleteGpgKeyForAuthenticatedUser } from "../../../types/paths/user/gpg_keys/{gpg_key_id}.types.js";

export const GET: usersGetGpgKeyForAuthenticatedUser = async ($) => {
  const key = $.context.getGpgKey($.path.gpg_key_id);
  return key ? $.response[200].json(key) : $.response[404].empty();
};

export const DELETE: usersDeleteGpgKeyForAuthenticatedUser = async ($) => {
  return $.context.deleteGpgKey($.path.gpg_key_id)
    ? $.response[204].empty()
    : $.response[404].empty();
};
