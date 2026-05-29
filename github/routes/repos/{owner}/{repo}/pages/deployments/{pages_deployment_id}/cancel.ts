import type { reposCancelPagesDeployment } from "../../../../../../../types/paths/repos/{owner}/{repo}/pages/deployments/{pages_deployment_id}/cancel.types.js";

export const POST: reposCancelPagesDeployment = async ($) => {
  return $.response[204].empty();
};
