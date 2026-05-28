import type { packagesGetPackageForAuthenticatedUser } from "../../../../types/paths/user/packages/{package_type}/{package_name}.types.js";
import type { packagesDeletePackageForAuthenticatedUser } from "../../../../types/paths/user/packages/{package_type}/{package_name}.types.js";

export const GET: packagesGetPackageForAuthenticatedUser = async ($) => {
  return $.response[200].random();
};

export const DELETE: packagesDeletePackageForAuthenticatedUser = async ($) => {
  return $.response[204].empty();
};
