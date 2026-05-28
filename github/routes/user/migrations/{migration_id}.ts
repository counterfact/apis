import type { migrationsGetStatusForAuthenticatedUser } from "../../../types/paths/user/migrations/{migration_id}.types.js";

export const GET: migrationsGetStatusForAuthenticatedUser = async ($) => {
  return $.response[200].random();
};
