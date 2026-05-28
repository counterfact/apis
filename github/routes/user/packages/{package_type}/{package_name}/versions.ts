import type { packagesGetAllPackageVersionsForPackageOwnedByAuthenticatedUser } from "../../../../../types/paths/user/packages/{package_type}/{package_name}/versions.types.js";

export const GET: packagesGetAllPackageVersionsForPackageOwnedByAuthenticatedUser =
  async ($) => {
    return $.response[200].random();
  };
