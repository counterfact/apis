import type { migrationsDownloadArchiveForOrg } from "../../../../../types/paths/orgs/{org}/migrations/{migration_id}/archive.types.js";
import type { migrationsDeleteArchiveForOrg } from "../../../../../types/paths/orgs/{org}/migrations/{migration_id}/archive.types.js";

export const GET: migrationsDownloadArchiveForOrg = async ($) => {
  return $.response[302].empty();
};

export const DELETE: migrationsDeleteArchiveForOrg = async ($) => {
  return $.response[204].empty();
};
