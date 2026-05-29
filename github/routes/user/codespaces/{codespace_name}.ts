import type { codespacesGetForAuthenticatedUser } from "../../../types/paths/user/codespaces/{codespace_name}.types.js";
import type { codespacesUpdateForAuthenticatedUser } from "../../../types/paths/user/codespaces/{codespace_name}.types.js";
import type { codespacesDeleteForAuthenticatedUser } from "../../../types/paths/user/codespaces/{codespace_name}.types.js";

export const GET: codespacesGetForAuthenticatedUser = async ($) => {
  return $.response[200].random();
};

export const PATCH: codespacesUpdateForAuthenticatedUser = async ($) => {
  return $.response[200].random();
};

export const DELETE: codespacesDeleteForAuthenticatedUser = async ($) => {
  return $.response[202].empty();
};
