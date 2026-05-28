import type { codespacesCheckPermissionsForDevcontainer } from "../../../../../types/paths/repos/{owner}/{repo}/codespaces/permissions_check.types.js";

export const GET: codespacesCheckPermissionsForDevcontainer = async ($) => {
  return $.response[200].random();
};
