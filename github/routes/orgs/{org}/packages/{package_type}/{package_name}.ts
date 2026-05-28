import type { packagesGetPackageForOrganization } from "../../../../../types/paths/orgs/{org}/packages/{package_type}/{package_name}.types.js";
import type { packagesDeletePackageForOrg } from "../../../../../types/paths/orgs/{org}/packages/{package_type}/{package_name}.types.js";

export const GET: packagesGetPackageForOrganization = async ($) => {
  return $.response[200].random();
};

export const DELETE: packagesDeletePackageForOrg = async ($) => {
  return $.response[204].empty();
};
