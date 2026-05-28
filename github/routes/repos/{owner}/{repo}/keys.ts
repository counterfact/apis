import type { reposListDeployKeys } from "../../../../types/paths/repos/{owner}/{repo}/keys.types.js";
import type { reposCreateDeployKey } from "../../../../types/paths/repos/{owner}/{repo}/keys.types.js";

export const GET: reposListDeployKeys = async ($) => {
  return $.response[200].random();
};

export const POST: reposCreateDeployKey = async ($) => {
  return $.response[201].random();
};
