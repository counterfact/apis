import type { usersListSshSigningKeysForAuthenticatedUser } from "../../types/paths/user/ssh_signing_keys.types.js";
import type { usersCreateSshSigningKeyForAuthenticatedUser } from "../../types/paths/user/ssh_signing_keys.types.js";

export const GET: usersListSshSigningKeysForAuthenticatedUser = async ($) => {
  return $.response[200].json($.context.listSshSigningKeys($.query));
};

export const POST: usersCreateSshSigningKeyForAuthenticatedUser = async ($) => {
  return $.response[201].json($.context.addSshSigningKey($.body));
};
