import type { packagesRestorePackageForUser } from "../../../../../../types/paths/users/{username}/packages/{package_type}/{package_name}/restore.types.js";

export const POST: packagesRestorePackageForUser = async ($) => {
  return $.response[204].empty();
};
