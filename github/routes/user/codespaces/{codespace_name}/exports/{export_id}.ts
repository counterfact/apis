import type { codespacesGetExportDetailsForAuthenticatedUser } from "../../../../../types/paths/user/codespaces/{codespace_name}/exports/{export_id}.types.js";

export const GET: codespacesGetExportDetailsForAuthenticatedUser = async (
  $,
) => {
  return $.response[200].random();
};
