import type { reposGetOrgRuleset } from "../../../../types/paths/orgs/{org}/rulesets/{ruleset_id}.types.js";
import type { reposUpdateOrgRuleset } from "../../../../types/paths/orgs/{org}/rulesets/{ruleset_id}.types.js";
import type { reposDeleteOrgRuleset } from "../../../../types/paths/orgs/{org}/rulesets/{ruleset_id}.types.js";

export const GET: reposGetOrgRuleset = async ($) => {
  return $.response[200].random();
};

export const PUT: reposUpdateOrgRuleset = async ($) => {
  return $.response[200].random();
};

export const DELETE: reposDeleteOrgRuleset = async ($) => {
  return $.response[204].empty();
};
