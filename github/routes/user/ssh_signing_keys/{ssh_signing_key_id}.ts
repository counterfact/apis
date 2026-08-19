import type { usersGetSshSigningKeyForAuthenticatedUser } from "../../../types/paths/user/ssh_signing_keys/{ssh_signing_key_id}.types.js";
import type { usersDeleteSshSigningKeyForAuthenticatedUser } from "../../../types/paths/user/ssh_signing_keys/{ssh_signing_key_id}.types.js";

export const GET: usersGetSshSigningKeyForAuthenticatedUser = async ($) => {
  const key = $.context.getSshSigningKey($.path.ssh_signing_key_id);
  return key ? $.response[200].json(key) : $.response[404].empty();
};

export const DELETE: usersDeleteSshSigningKeyForAuthenticatedUser = async (
  $,
) => {
  return $.context.deleteSshSigningKey($.path.ssh_signing_key_id)
    ? $.response[204].empty()
    : $.response[404].empty();
};
