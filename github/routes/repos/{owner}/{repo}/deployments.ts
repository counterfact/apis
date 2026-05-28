import type { reposListDeployments } from "../../../../types/paths/repos/{owner}/{repo}/deployments.types.js";
import type { reposCreateDeployment } from "../../../../types/paths/repos/{owner}/{repo}/deployments.types.js";

export const GET: reposListDeployments = async ($) => {
  return $.response[200].random();
};

export const POST: reposCreateDeployment = async ($) => {
  return $.response[201].random();
};
