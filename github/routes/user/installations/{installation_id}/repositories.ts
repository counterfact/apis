import type { appsListInstallationReposForAuthenticatedUser } from "../../../../types/paths/user/installations/{installation_id}/repositories.types.js";

export const GET: appsListInstallationReposForAuthenticatedUser = async ($) => {
  return $.response[200].random();
};
