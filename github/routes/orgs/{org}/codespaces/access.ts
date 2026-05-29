import type { codespacesSetCodespacesAccess } from "../../../../types/paths/orgs/{org}/codespaces/access.types.js";

export const PUT: codespacesSetCodespacesAccess = async ($) => {
  return $.response[204].empty();
};
