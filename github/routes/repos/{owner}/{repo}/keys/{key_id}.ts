import type { reposGetDeployKey } from "../../../../../types/paths/repos/{owner}/{repo}/keys/{key_id}.types.js";
import type { reposDeleteDeployKey } from "../../../../../types/paths/repos/{owner}/{repo}/keys/{key_id}.types.js";

export const GET: reposGetDeployKey = async ($) => {
  return $.response[200].random();
};

export const DELETE: reposDeleteDeployKey = async ($) => {
  return $.response[204].empty();
};
