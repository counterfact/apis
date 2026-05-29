import type { usersListPublicKeysForUser } from "../../../types/paths/users/{username}/keys.types.js";

export const GET: usersListPublicKeysForUser = async ($) => {
  return $.response[200].random();
};
