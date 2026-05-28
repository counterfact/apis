import type { dependabotRepositoryAccessForOrg } from "../../../../types/paths/orgs/{org}/dependabot/repository-access.types.js";
import type { dependabotUpdateRepositoryAccessForOrg } from "../../../../types/paths/orgs/{org}/dependabot/repository-access.types.js";

export const GET: dependabotRepositoryAccessForOrg = async ($) => {
  return $.response[200].random();
};

export const PATCH: dependabotUpdateRepositoryAccessForOrg = async ($) => {
  return $.response[204].empty();
};
