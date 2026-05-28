import type { orgsGetOrgRulesetHistory } from "../../../../../types/paths/orgs/{org}/rulesets/{ruleset_id}/history.types.js";

export const GET: orgsGetOrgRulesetHistory = async ($) => {
  return $.response[200].random();
};
