import type { packagesGetPackageForUser } from "../../../../../types/paths/users/{username}/packages/{package_type}/{package_name}.types.js";
import type { packagesDeletePackageForUser } from "../../../../../types/paths/users/{username}/packages/{package_type}/{package_name}.types.js";

export const GET: packagesGetPackageForUser = async ($) => {
  return $.response[200].random();
};

export const DELETE: packagesDeletePackageForUser = async ($) => {
  return $.response[204].empty();
};
