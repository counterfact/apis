import type { reposGetRepoRulesets } from "../../../../types/paths/repos/{owner}/{repo}/rulesets.types.js";
import type { reposCreateRepoRuleset } from "../../../../types/paths/repos/{owner}/{repo}/rulesets.types.js";

export const GET: reposGetRepoRulesets = async ($) => {
  return $.response[200].random();
};

export const POST: reposCreateRepoRuleset = async ($) => {
  return $.response[201].random();
};
