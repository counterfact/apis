import type { usersListPublicEmailsForAuthenticatedUser } from "../../types/paths/user/public_emails.types.js";

export const GET: usersListPublicEmailsForAuthenticatedUser = async ($) => {
  return $.response[200].random();
};
