import type { dependabotRepositoryAccessForEnterprise } from "../../../../types/paths/enterprises/{enterprise}/dependabot/repository-access.types.js";
import type { dependabotUpdateRepositoryAccessForEnterprise } from "../../../../types/paths/enterprises/{enterprise}/dependabot/repository-access.types.js";

export const GET: dependabotRepositoryAccessForEnterprise = async ($) => {
  return $.response[200].random();
};

export const PATCH: dependabotUpdateRepositoryAccessForEnterprise = async (
  $,
) => {
  return $.response[204].empty();
};
