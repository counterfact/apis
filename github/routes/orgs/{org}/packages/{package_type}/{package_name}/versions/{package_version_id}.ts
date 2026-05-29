import type { packagesGetPackageVersionForOrganization } from "../../../../../../../types/paths/orgs/{org}/packages/{package_type}/{package_name}/versions/{package_version_id}.types.js";
import type { packagesDeletePackageVersionForOrg } from "../../../../../../../types/paths/orgs/{org}/packages/{package_type}/{package_name}/versions/{package_version_id}.types.js";

export const GET: packagesGetPackageVersionForOrganization = async ($) => {
  return $.response[200].random();
};

export const DELETE: packagesDeletePackageVersionForOrg = async ($) => {
  return $.response[204].empty();
};
