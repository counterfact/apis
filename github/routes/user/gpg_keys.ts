import type { usersListGpgKeysForAuthenticatedUser } from "../../types/paths/user/gpg_keys.types.js";
import type { usersCreateGpgKeyForAuthenticatedUser } from "../../types/paths/user/gpg_keys.types.js";

export const GET: usersListGpgKeysForAuthenticatedUser = async ($) => {
  return $.response[200].random();
};

export const POST: usersCreateGpgKeyForAuthenticatedUser = async ($) => {
  return $.response[201].random();
};
