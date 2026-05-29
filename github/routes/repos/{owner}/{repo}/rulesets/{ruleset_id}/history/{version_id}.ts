import type { reposGetRepoRulesetVersion } from "../../../../../../../types/paths/repos/{owner}/{repo}/rulesets/{ruleset_id}/history/{version_id}.types.js";

export const GET: reposGetRepoRulesetVersion = async ($) => {
  return $.response[200].random();
};
