import type { reposGetRepoRuleSuites } from "../../../../../types/paths/repos/{owner}/{repo}/rulesets/rule-suites.types.js";

export const GET: reposGetRepoRuleSuites = async ($) => {
  return $.response[200].random();
};
