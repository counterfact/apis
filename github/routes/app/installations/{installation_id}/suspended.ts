import type { appsSuspendInstallation } from "../../../../types/paths/app/installations/{installation_id}/suspended.types.js";
import type { appsUnsuspendInstallation } from "../../../../types/paths/app/installations/{installation_id}/suspended.types.js";

export const PUT: appsSuspendInstallation = async ($) => {
  return $.response[204].empty();
};

export const DELETE: appsUnsuspendInstallation = async ($) => {
  return $.response[204].empty();
};
