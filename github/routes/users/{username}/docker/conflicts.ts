import type { packagesListDockerMigrationConflictingPackagesForUser } from "../../../../types/paths/users/{username}/docker/conflicts.types.js";

export const GET: packagesListDockerMigrationConflictingPackagesForUser =
  async ($) => {
    return $.response[200].random();
  };
