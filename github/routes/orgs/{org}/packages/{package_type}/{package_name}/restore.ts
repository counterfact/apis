import type { packagesRestorePackageForOrg } from "../../../../../../types/paths/orgs/{org}/packages/{package_type}/{package_name}/restore.types.js";

export const POST: packagesRestorePackageForOrg = async ($) => {
  return $.response[204].empty();
};
