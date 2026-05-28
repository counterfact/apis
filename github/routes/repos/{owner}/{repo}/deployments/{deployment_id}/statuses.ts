import type { reposListDeploymentStatuses } from "../../../../../../types/paths/repos/{owner}/{repo}/deployments/{deployment_id}/statuses.types.js";
import type { reposCreateDeploymentStatus } from "../../../../../../types/paths/repos/{owner}/{repo}/deployments/{deployment_id}/statuses.types.js";

export const GET: reposListDeploymentStatuses = async ($) => {
  return $.response[200].random();
};

export const POST: reposCreateDeploymentStatus = async ($) => {
  return $.response[201].random();
};
