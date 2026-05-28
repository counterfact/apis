import type { codespacesListForAuthenticatedUser } from "../../types/paths/user/codespaces.types.js";
import type { codespacesCreateForAuthenticatedUser } from "../../types/paths/user/codespaces.types.js";

export const GET: codespacesListForAuthenticatedUser = async ($) => {
  return $.response[200].random();
};

export const POST: codespacesCreateForAuthenticatedUser = async ($) => {
  return $.response[201].random();
};
