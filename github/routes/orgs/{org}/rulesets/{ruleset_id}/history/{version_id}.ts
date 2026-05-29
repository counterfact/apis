import type { orgsGetOrgRulesetVersion } from "../../../../../../types/paths/orgs/{org}/rulesets/{ruleset_id}/history/{version_id}.types.js";

export const GET: orgsGetOrgRulesetVersion = async ($) => {
  return $.response[200].random();
};
