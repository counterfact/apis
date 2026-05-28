import type { appsCreateInstallationAccessToken } from "../../../../types/paths/app/installations/{installation_id}/access_tokens.types.js";

export const POST: appsCreateInstallationAccessToken = async ($) => {
  return $.response[201].random();
};
