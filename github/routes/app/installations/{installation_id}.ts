import type { appsGetInstallation } from "../../../types/paths/app/installations/{installation_id}.types.js";
import type { appsDeleteInstallation } from "../../../types/paths/app/installations/{installation_id}.types.js";

export const GET: appsGetInstallation = async ($) => {
  return $.response[200].random();
};

export const DELETE: appsDeleteInstallation = async ($) => {
  return $.response[204].empty();
};
