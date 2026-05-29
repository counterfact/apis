import type { usersListSshSigningKeysForUser } from "../../../types/paths/users/{username}/ssh_signing_keys.types.js";

export const GET: usersListSshSigningKeysForUser = async ($) => {
  return $.response[200].random();
};
