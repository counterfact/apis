import type { packagesRestorePackageVersionForOrg } from "../../../../../../../../types/paths/orgs/{org}/packages/{package_type}/{package_name}/versions/{package_version_id}/restore.types.js";

export const POST: packagesRestorePackageVersionForOrg = async ($) => {
  return $.response[204].empty();
};
