import type { reposListDeploymentBranchPolicies } from "../../../../../../types/paths/repos/{owner}/{repo}/environments/{environment_name}/deployment-branch-policies.types.js";
import type { reposCreateDeploymentBranchPolicy } from "../../../../../../types/paths/repos/{owner}/{repo}/environments/{environment_name}/deployment-branch-policies.types.js";

export const GET: reposListDeploymentBranchPolicies = async ($) => {
  return $.response[200].random();
};

export const POST: reposCreateDeploymentBranchPolicy = async ($) => {
  return $.response[200].random();
};
