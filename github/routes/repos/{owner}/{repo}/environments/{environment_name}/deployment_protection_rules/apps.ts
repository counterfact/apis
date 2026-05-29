import type { reposListCustomDeploymentRuleIntegrations } from "../../../../../../../types/paths/repos/{owner}/{repo}/environments/{environment_name}/deployment_protection_rules/apps.types.js";

export const GET: reposListCustomDeploymentRuleIntegrations = async ($) => {
  return $.response[200].random();
};
