import type { codespacesGetRepoSecret } from "../../../../../../types/paths/repos/{owner}/{repo}/codespaces/secrets/{secret_name}.types.js";
import type { codespacesCreateOrUpdateRepoSecret } from "../../../../../../types/paths/repos/{owner}/{repo}/codespaces/secrets/{secret_name}.types.js";
import type { codespacesDeleteRepoSecret } from "../../../../../../types/paths/repos/{owner}/{repo}/codespaces/secrets/{secret_name}.types.js";

export const GET: codespacesGetRepoSecret = async ($) => {
  return $.response[200].random();
};

export const PUT: codespacesCreateOrUpdateRepoSecret = async ($) => {
  return $.response[201].random();
};

export const DELETE: codespacesDeleteRepoSecret = async ($) => {
  return $.response[204].empty();
};
