import type { usersGetAuthenticated } from "../types/paths/user.types.js";
import type { usersUpdateAuthenticated } from "../types/paths/user.types.js";

export const GET: usersGetAuthenticated = async ($) => {
  return $.response[200].json($.context.getProfile());
};

export const PATCH: usersUpdateAuthenticated = async ($) => {
  return $.response[200].json($.context.updateProfile($.body));
};
