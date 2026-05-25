import type { createUsersWithListInput } from "../../types/paths/user/createWithList.types.js";

export const POST: createUsersWithListInput = async ($) => {
  if ($.body.length === 0) {
    return $.response[400].empty();
  }

  const createdUsers = $.body.map((user) => $.context.saveUser(user));
  return $.response[200].json(createdUsers[createdUsers.length - 1]);
};
