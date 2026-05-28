import type { packagesGetAllPackageVersionsForPackageOwnedByOrg } from "../../../../../../types/paths/orgs/{org}/packages/{package_type}/{package_name}/versions.types.js";

export const GET: packagesGetAllPackageVersionsForPackageOwnedByOrg = async (
  $,
) => {
  return $.response[200].random();
};
