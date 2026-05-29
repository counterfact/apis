import type { appsListInstallationsForAuthenticatedUser } from "../../types/paths/user/installations.types.js";

export const GET: appsListInstallationsForAuthenticatedUser = async ($) => {
  return $.response[200].random();
};
