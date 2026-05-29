import type { usersListGpgKeysForUser } from "../../../types/paths/users/{username}/gpg_keys.types.js";

export const GET: usersListGpgKeysForUser = async ($) => {
  return $.response[200].random();
};
