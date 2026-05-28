import type { packagesRestorePackageVersionForUser } from "../../../../../../../../types/paths/users/{username}/packages/{package_type}/{package_name}/versions/{package_version_id}/restore.types.js";

export const POST: packagesRestorePackageVersionForUser = async ($) => {
  return $.response[204].empty();
};
