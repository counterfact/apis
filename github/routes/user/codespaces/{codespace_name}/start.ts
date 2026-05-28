import type { codespacesStartForAuthenticatedUser } from "../../../../types/paths/user/codespaces/{codespace_name}/start.types.js";

export const POST: codespacesStartForAuthenticatedUser = async ($) => {
  return $.response[200].random();
};
