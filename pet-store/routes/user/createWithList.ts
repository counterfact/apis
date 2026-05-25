import type { createUsersWithListInput } from "../../types/paths/user/createWithList.types.js";

export const POST: createUsersWithListInput = async ($) => {
  const createdUsers = $.body.map((user) => $.context.saveUser(user));
  return $.response[200].json(createdUsers[0] ?? { username: "user-0" });
};
