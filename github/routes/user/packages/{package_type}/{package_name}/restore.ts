import type { packagesRestorePackageForAuthenticatedUser } from "../../../../../types/paths/user/packages/{package_type}/{package_name}/restore.types.js";

export const POST: packagesRestorePackageForAuthenticatedUser = async ($) => {
  return $.response[204].empty();
};
