import type { codespacesSetCodespacesAccessUsers } from "../../../../../types/paths/orgs/{org}/codespaces/access/selected_users.types.js";
import type { codespacesDeleteCodespacesAccessUsers } from "../../../../../types/paths/orgs/{org}/codespaces/access/selected_users.types.js";

export const POST: codespacesSetCodespacesAccessUsers = async ($) => {
  return $.response[204].empty();
};

export const DELETE: codespacesDeleteCodespacesAccessUsers = async ($) => {
  return $.response[204].empty();
};
