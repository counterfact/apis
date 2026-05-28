import type { reposGetCustomDeploymentProtectionRule } from "../../../../../../../types/paths/repos/{owner}/{repo}/environments/{environment_name}/deployment_protection_rules/{protection_rule_id}.types.js";
import type { reposDisableDeploymentProtectionRule } from "../../../../../../../types/paths/repos/{owner}/{repo}/environments/{environment_name}/deployment_protection_rules/{protection_rule_id}.types.js";

export const GET: reposGetCustomDeploymentProtectionRule = async ($) => {
  return $.response[200].random();
};

export const DELETE: reposDisableDeploymentProtectionRule = async ($) => {
  return $.response[204].empty();
};
