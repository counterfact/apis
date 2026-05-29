import type { packagesGetAllPackageVersionsForPackageOwnedByUser } from "../../../../../../types/paths/users/{username}/packages/{package_type}/{package_name}/versions.types.js";

export const GET: packagesGetAllPackageVersionsForPackageOwnedByUser = async (
  $,
) => {
  return $.response[200].random();
};
