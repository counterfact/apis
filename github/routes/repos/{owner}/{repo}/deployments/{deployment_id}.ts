import type { reposGetDeployment } from "../../../../../types/paths/repos/{owner}/{repo}/deployments/{deployment_id}.types.js";
import type { reposDeleteDeployment } from "../../../../../types/paths/repos/{owner}/{repo}/deployments/{deployment_id}.types.js";

export const GET: reposGetDeployment = async ($) => {
  return $.response[200].random();
};

export const DELETE: reposDeleteDeployment = async ($) => {
  return $.response[204].empty();
};
