import type { packagesListDockerMigrationConflictingPackagesForOrganization } from "../../../../types/paths/orgs/{org}/docker/conflicts.types.js";

export const GET: packagesListDockerMigrationConflictingPackagesForOrganization =
  async ($) => {
    return $.response[200].random();
  };
