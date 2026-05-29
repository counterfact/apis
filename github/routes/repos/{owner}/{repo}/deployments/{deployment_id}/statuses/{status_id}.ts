import type { reposGetDeploymentStatus } from "../../../../../../../types/paths/repos/{owner}/{repo}/deployments/{deployment_id}/statuses/{status_id}.types.js";

export const GET: reposGetDeploymentStatus = async ($) => {
  return $.response[200].random();
};
