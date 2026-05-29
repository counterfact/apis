import type { usersGetPublicSshKeyForAuthenticatedUser } from "../../../types/paths/user/keys/{key_id}.types.js";
import type { usersDeletePublicSshKeyForAuthenticatedUser } from "../../../types/paths/user/keys/{key_id}.types.js";

export const GET: usersGetPublicSshKeyForAuthenticatedUser = async ($) => {
  return $.response[200].random();
};

export const DELETE: usersDeletePublicSshKeyForAuthenticatedUser = async (
  $,
) => {
  return $.response[204].empty();
};
