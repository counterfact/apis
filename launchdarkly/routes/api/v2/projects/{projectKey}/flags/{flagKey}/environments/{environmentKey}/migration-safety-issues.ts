import type { postMigrationSafetyIssues } from "../../../../../../../../../types/paths/api/v2/projects/{projectKey}/flags/{flagKey}/environments/{environmentKey}/migration-safety-issues.types.js";

export const POST: postMigrationSafetyIssues = async ($) => {
  return $.response[200].random();
};
