import type { appsAddRepoToInstallationForAuthenticatedUser } from "../../../../../types/paths/user/installations/{installation_id}/repositories/{repository_id}.types.js";
import type { appsRemoveRepoFromInstallationForAuthenticatedUser } from "../../../../../types/paths/user/installations/{installation_id}/repositories/{repository_id}.types.js";

export const PUT: appsAddRepoToInstallationForAuthenticatedUser = async ($) => {
  return $.response[204].empty();
};

export const DELETE: appsRemoveRepoFromInstallationForAuthenticatedUser =
  async ($) => {
    return $.response[204].empty();
  };
