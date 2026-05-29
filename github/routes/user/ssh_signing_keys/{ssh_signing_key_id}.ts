import type { usersGetSshSigningKeyForAuthenticatedUser } from "../../../types/paths/user/ssh_signing_keys/{ssh_signing_key_id}.types.js";
import type { usersDeleteSshSigningKeyForAuthenticatedUser } from "../../../types/paths/user/ssh_signing_keys/{ssh_signing_key_id}.types.js";

export const GET: usersGetSshSigningKeyForAuthenticatedUser = async ($) => {
  return $.response[200].random();
};

export const DELETE: usersDeleteSshSigningKeyForAuthenticatedUser = async (
  $,
) => {
  return $.response[204].empty();
};
