import type { reposGetOrgRuleSuites } from "../../../../types/paths/orgs/{org}/rulesets/rule-suites.types.js";

export const GET: reposGetOrgRuleSuites = async ($) => {
  return $.response[200].random();
};
