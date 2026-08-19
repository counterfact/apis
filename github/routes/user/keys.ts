import type { usersListPublicSshKeysForAuthenticatedUser } from "../../types/paths/user/keys.types.js";
import type { usersCreatePublicSshKeyForAuthenticatedUser } from "../../types/paths/user/keys.types.js";

export const GET: usersListPublicSshKeysForAuthenticatedUser = async ($) => {
  return $.response[200].json($.context.listSshKeys($.query));
};

export const POST: usersCreatePublicSshKeyForAuthenticatedUser = async ($) => {
  return $.response[201].json($.context.addSshKey($.body));
};
