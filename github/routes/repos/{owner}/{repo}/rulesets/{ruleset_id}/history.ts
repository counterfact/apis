import type { reposGetRepoRulesetHistory } from "../../../../../../types/paths/repos/{owner}/{repo}/rulesets/{ruleset_id}/history.types.js";

export const GET: reposGetRepoRulesetHistory = async ($) => {
  return $.response[200].random();
};
