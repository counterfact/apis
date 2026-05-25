import type { getUserByName } from "../../types/paths/user/{username}.types.js";
import type { updateUser } from "../../types/paths/user/{username}.types.js";
import type { deleteUser } from "../../types/paths/user/{username}.types.js";

export const GET: getUserByName = async ($) => {
  const user = $.context.getUser($.path.username);
  if (!user) {
    return $.response[404].empty();
  }
  return $.response[200].json(user);
};

export const PUT: updateUser = async ($) => {
  if (!$.context.hasUser($.path.username)) {
    return $.response[404].empty();
  }
  if ($.body.username && $.body.username !== $.path.username) {
    return $.response[400].empty();
  }

  $.context.saveUser({ ...$.body, username: $.path.username });
  return $.response[200].empty();
};

export const DELETE: deleteUser = async ($) => {
  if (!$.context.hasUser($.path.username)) {
    return $.response[404].empty();
  }
  $.context.deleteUser($.path.username);
  return $.response[200].empty();
};
