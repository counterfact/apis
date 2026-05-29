import type { reposGetPagesDeployment } from "../../../../../../types/paths/repos/{owner}/{repo}/pages/deployments/{pages_deployment_id}.types.js";

export const GET: reposGetPagesDeployment = async ($) => {
  return $.response[200].random();
};
