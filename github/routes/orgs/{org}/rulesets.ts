import type { reposGetOrgRulesets } from "../../../types/paths/orgs/{org}/rulesets.types.js";
import type { reposCreateOrgRuleset } from "../../../types/paths/orgs/{org}/rulesets.types.js";

export const GET: reposGetOrgRulesets = async ($) => {
  return $.response[200].random();
};

export const POST: reposCreateOrgRuleset = async ($) => {
  return $.response[201].random();
};
