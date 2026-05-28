import type { migrationsGetArchiveForAuthenticatedUser } from "../../../../types/paths/user/migrations/{migration_id}/archive.types.js";
import type { migrationsDeleteArchiveForAuthenticatedUser } from "../../../../types/paths/user/migrations/{migration_id}/archive.types.js";

export const GET: migrationsGetArchiveForAuthenticatedUser = async ($) => {
  return $.response[302].empty();
};

export const DELETE: migrationsDeleteArchiveForAuthenticatedUser = async (
  $,
) => {
  return $.response[204].empty();
};
