import type { packagesGetPackageVersionForUser } from "../../../../../../../types/paths/users/{username}/packages/{package_type}/{package_name}/versions/{package_version_id}.types.js";
import type { packagesDeletePackageVersionForUser } from "../../../../../../../types/paths/users/{username}/packages/{package_type}/{package_name}/versions/{package_version_id}.types.js";

export const GET: packagesGetPackageVersionForUser = async ($) => {
  return $.response[200].random();
};

export const DELETE: packagesDeletePackageVersionForUser = async ($) => {
  return $.response[204].empty();
};
