import type { usersListEmailsForAuthenticatedUser } from "../../types/paths/user/emails.types.js";
import type { usersAddEmailForAuthenticatedUser } from "../../types/paths/user/emails.types.js";
import type { usersDeleteEmailForAuthenticatedUser } from "../../types/paths/user/emails.types.js";

export const GET: usersListEmailsForAuthenticatedUser = async ($) => {
  return $.response[200].random();
};

export const POST: usersAddEmailForAuthenticatedUser = async ($) => {
  return $.response[201].random();
};

export const DELETE: usersDeleteEmailForAuthenticatedUser = async ($) => {
  return $.response[204].empty();
};
