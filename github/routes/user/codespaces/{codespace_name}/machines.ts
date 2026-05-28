import type { codespacesCodespaceMachinesForAuthenticatedUser } from "../../../../types/paths/user/codespaces/{codespace_name}/machines.types.js";

export const GET: codespacesCodespaceMachinesForAuthenticatedUser = async (
  $,
) => {
  return $.response[200].random();
};
