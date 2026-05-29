import type { migrationsUnlockRepoForAuthenticatedUser } from "../../../../../../types/paths/user/migrations/{migration_id}/repos/{repo_name}/lock.types.js";

export const DELETE: migrationsUnlockRepoForAuthenticatedUser = async ($) => {
  return $.response[204].empty();
};
