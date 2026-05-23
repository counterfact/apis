import type { getUserByName } from "../../types/paths/user/{username}.types.js";
import type { updateUser } from "../../types/paths/user/{username}.types.js";
import type { deleteUser } from "../../types/paths/user/{username}.types.js";

export const GET: getUserByName = async ($) => {
  return $.response[200].random();
};

export const PUT: updateUser = async ($) => {
  return $.response[200].empty();
};

export const DELETE: deleteUser = async ($) => {
  return $.response[200].empty();
};
