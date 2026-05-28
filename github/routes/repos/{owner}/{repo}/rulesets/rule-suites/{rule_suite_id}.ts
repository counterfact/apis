import type { reposGetRepoRuleSuite } from "../../../../../../types/paths/repos/{owner}/{repo}/rulesets/rule-suites/{rule_suite_id}.types.js";

export const GET: reposGetRepoRuleSuite = async ($) => {
  return $.response[200].random();
};
