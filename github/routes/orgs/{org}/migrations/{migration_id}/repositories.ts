import type { migrationsListReposForOrg } from "../../../../../types/paths/orgs/{org}/migrations/{migration_id}/repositories.types.js";

export const GET: migrationsListReposForOrg = async ($) => {
  return $.response[200].random();
};
