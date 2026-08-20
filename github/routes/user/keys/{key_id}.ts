import type { usersGetPublicSshKeyForAuthenticatedUser } from "../../../types/paths/user/keys/{key_id}.types.js";
import type { usersDeletePublicSshKeyForAuthenticatedUser } from "../../../types/paths/user/keys/{key_id}.types.js";

export const GET: usersGetPublicSshKeyForAuthenticatedUser = async ($) => {
  const key = $.context.getSshKey($.path.key_id);
  return key
    ? $.response[200].json(key)
    : $.response[404].json({ message: "Not Found", status: "404" });
};

export const DELETE: usersDeletePublicSshKeyForAuthenticatedUser = async (
  $,
) => {
  return $.context.deleteSshKey($.path.key_id)
    ? $.response[204].empty()
    : $.response[404].json({ message: "Not Found", status: "404" });
};
