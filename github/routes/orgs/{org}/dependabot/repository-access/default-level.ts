import type { dependabotSetRepositoryAccessDefaultLevel } from "../../../../../types/paths/orgs/{org}/dependabot/repository-access/default-level.types.js";

export const PUT: dependabotSetRepositoryAccessDefaultLevel = async ($) => {
  return $.response[204].empty();
};
