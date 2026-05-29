import type { reposGetDeploymentBranchPolicy } from "../../../../../../../types/paths/repos/{owner}/{repo}/environments/{environment_name}/deployment-branch-policies/{branch_policy_id}.types.js";
import type { reposUpdateDeploymentBranchPolicy } from "../../../../../../../types/paths/repos/{owner}/{repo}/environments/{environment_name}/deployment-branch-policies/{branch_policy_id}.types.js";
import type { reposDeleteDeploymentBranchPolicy } from "../../../../../../../types/paths/repos/{owner}/{repo}/environments/{environment_name}/deployment-branch-policies/{branch_policy_id}.types.js";

export const GET: reposGetDeploymentBranchPolicy = async ($) => {
  return $.response[200].random();
};

export const PUT: reposUpdateDeploymentBranchPolicy = async ($) => {
  return $.response[200].random();
};

export const DELETE: reposDeleteDeploymentBranchPolicy = async ($) => {
  return $.response[204].empty();
};
