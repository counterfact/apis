import type { packagesRestorePackageVersionForAuthenticatedUser } from "../../../../../../../types/paths/user/packages/{package_type}/{package_name}/versions/{package_version_id}/restore.types.js";

export const POST: packagesRestorePackageVersionForAuthenticatedUser = async (
  $,
) => {
  return $.response[204].empty();
};
