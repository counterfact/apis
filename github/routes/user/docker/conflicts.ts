import type { packagesListDockerMigrationConflictingPackagesForAuthenticatedUser } from "../../../types/paths/user/docker/conflicts.types.js";

export const GET: packagesListDockerMigrationConflictingPackagesForAuthenticatedUser =
  async ($) => {
    return $.response[200].random();
  };
