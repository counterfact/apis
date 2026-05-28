import type { reposGetRepoRuleset } from "../../../../../types/paths/repos/{owner}/{repo}/rulesets/{ruleset_id}.types.js";
import type { reposUpdateRepoRuleset } from "../../../../../types/paths/repos/{owner}/{repo}/rulesets/{ruleset_id}.types.js";
import type { reposDeleteRepoRuleset } from "../../../../../types/paths/repos/{owner}/{repo}/rulesets/{ruleset_id}.types.js";

export const GET: reposGetRepoRuleset = async ($) => {
  return $.response[200].random();
};

export const PUT: reposUpdateRepoRuleset = async ($) => {
  return $.response[200].random();
};

export const DELETE: reposDeleteRepoRuleset = async ($) => {
  return $.response[204].empty();
};
