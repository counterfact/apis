import type { packagesListPackagesForOrganization } from "../../../types/paths/orgs/{org}/packages.types.js";

export const GET: packagesListPackagesForOrganization = async ($) => {
  return $.response[200].random();
};
