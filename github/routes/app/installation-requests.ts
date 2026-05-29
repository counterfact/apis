import type { appsListInstallationRequestsForAuthenticatedApp } from "../../types/paths/app/installation-requests.types.js";

export const GET: appsListInstallationRequestsForAuthenticatedApp = async (
  $,
) => {
  return $.response[200].random();
};
