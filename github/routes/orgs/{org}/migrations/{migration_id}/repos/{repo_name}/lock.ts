import type { migrationsUnlockRepoForOrg } from "../../../../../../../types/paths/orgs/{org}/migrations/{migration_id}/repos/{repo_name}/lock.types.js";

export const DELETE: migrationsUnlockRepoForOrg = async ($) => {
  return $.response[204].empty();
};
