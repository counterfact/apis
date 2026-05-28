import type { reposGetOrgRuleSuite } from "../../../../../types/paths/orgs/{org}/rulesets/rule-suites/{rule_suite_id}.types.js";

export const GET: reposGetOrgRuleSuite = async ($) => {
  return $.response[200].random();
};
