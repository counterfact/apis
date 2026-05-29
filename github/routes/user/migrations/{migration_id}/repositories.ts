import type { migrationsListReposForAuthenticatedUser } from "../../../../types/paths/user/migrations/{migration_id}/repositories.types.js";

export const GET: migrationsListReposForAuthenticatedUser = async ($) => {
  return $.response[200].random();
};
