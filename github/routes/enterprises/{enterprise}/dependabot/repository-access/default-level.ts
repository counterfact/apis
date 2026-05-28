import type { dependabotSetRepositoryAccessDefaultLevelForEnterprise } from "../../../../../types/paths/enterprises/{enterprise}/dependabot/repository-access/default-level.types.js";

export const PUT: dependabotSetRepositoryAccessDefaultLevelForEnterprise =
  async ($) => {
    return $.response[204].empty();
  };
