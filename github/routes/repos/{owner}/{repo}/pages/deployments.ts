import type { reposCreatePagesDeployment } from "../../../../../types/paths/repos/{owner}/{repo}/pages/deployments.types.js";

export const POST: reposCreatePagesDeployment = async ($) => {
  return $.response[200].random();
};
