import type { appsGetOrgInstallation } from "../../../types/paths/orgs/{org}/installation.types.js";

export const GET: appsGetOrgInstallation = async ($) => {
  return $.response[200].random();
};
