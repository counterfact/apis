import type { migrationsListForAuthenticatedUser } from "../../types/paths/user/migrations.types.js";
import type { migrationsStartForAuthenticatedUser } from "../../types/paths/user/migrations.types.js";

export const GET: migrationsListForAuthenticatedUser = async ($) => {
  return $.response[200].random();
};

export const POST: migrationsStartForAuthenticatedUser = async ($) => {
  return $.response[201].random();
};
