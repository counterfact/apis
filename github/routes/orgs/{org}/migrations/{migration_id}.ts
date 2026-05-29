import type { migrationsGetStatusForOrg } from "../../../../types/paths/orgs/{org}/migrations/{migration_id}.types.js";

export const GET: migrationsGetStatusForOrg = async ($) => {
  return $.response[200].random();
};
