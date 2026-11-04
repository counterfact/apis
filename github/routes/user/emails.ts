import type { usersListEmailsForAuthenticatedUser } from "../../types/paths/user/emails.types.js";
import type { usersAddEmailForAuthenticatedUser } from "../../types/paths/user/emails.types.js";
import type { usersDeleteEmailForAuthenticatedUser } from "../../types/paths/user/emails.types.js";

export const GET: usersListEmailsForAuthenticatedUser = async ($) => {
  return $.response[200].json($.context.listEmails($.query));
};

export const POST: usersAddEmailForAuthenticatedUser = async ($) => {
  const addresses = Array.isArray($.body)
    ? $.body
    : typeof $.body === "string"
      ? [$.body]
      : $.body.emails;
  return $.response[201].json(
    addresses.map((address) => $.context.addEmail(address)),
  );
};

export const DELETE: usersDeleteEmailForAuthenticatedUser = async ($) => {
  const addresses = Array.isArray($.body)
    ? $.body
    : typeof $.body === "string"
      ? [$.body]
      : $.body.emails;
  addresses.forEach((address) => $.context.deleteEmail(address));
  return $.response[204].empty();
};
