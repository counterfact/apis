import type { codespacesExportForAuthenticatedUser } from "../../../../types/paths/user/codespaces/{codespace_name}/exports.types.js";

export const POST: codespacesExportForAuthenticatedUser = async ($) => {
  return $.response[202].random();
};
