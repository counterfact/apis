import type { appsRevokeInstallationAccessToken } from "../../types/paths/installation/token.types.js";

export const DELETE: appsRevokeInstallationAccessToken = async ($) => {
  return $.response[204].empty();
};
