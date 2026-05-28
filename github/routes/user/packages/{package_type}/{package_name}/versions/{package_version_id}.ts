import type { packagesGetPackageVersionForAuthenticatedUser } from "../../../../../../types/paths/user/packages/{package_type}/{package_name}/versions/{package_version_id}.types.js";
import type { packagesDeletePackageVersionForAuthenticatedUser } from "../../../../../../types/paths/user/packages/{package_type}/{package_name}/versions/{package_version_id}.types.js";

export const GET: packagesGetPackageVersionForAuthenticatedUser = async ($) => {
  return $.response[200].random();
};

export const DELETE: packagesDeletePackageVersionForAuthenticatedUser = async (
  $,
) => {
  return $.response[204].empty();
};
