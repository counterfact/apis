import type { migrationsListForOrg } from "../../../types/paths/orgs/{org}/migrations.types.js";
import type { migrationsStartForOrg } from "../../../types/paths/orgs/{org}/migrations.types.js";

export const GET: migrationsListForOrg = async ($) => {
  return $.response[200].random();
};

export const POST: migrationsStartForOrg = async ($) => {
  return $.response[201].random();
};
