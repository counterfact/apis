import type { reposGetAllDeploymentProtectionRules } from "../../../../../../types/paths/repos/{owner}/{repo}/environments/{environment_name}/deployment_protection_rules.types.js";
import type { reposCreateDeploymentProtectionRule } from "../../../../../../types/paths/repos/{owner}/{repo}/environments/{environment_name}/deployment_protection_rules.types.js";

export const GET: reposGetAllDeploymentProtectionRules = async ($) => {
  return $.response[200].random();
};

export const POST: reposCreateDeploymentProtectionRule = async ($) => {
  return $.response[201].random();
};
