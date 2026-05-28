import type { agentsGetRepoSecret } from "../../../../../../types/paths/repos/{owner}/{repo}/agents/secrets/{secret_name}.types.js";
import type { agentsCreateOrUpdateRepoSecret } from "../../../../../../types/paths/repos/{owner}/{repo}/agents/secrets/{secret_name}.types.js";
import type { agentsDeleteRepoSecret } from "../../../../../../types/paths/repos/{owner}/{repo}/agents/secrets/{secret_name}.types.js";

export const GET: agentsGetRepoSecret = async ($) => {
  return $.response[200].random();
};

export const PUT: agentsCreateOrUpdateRepoSecret = async ($) => {
  return $.response[201].random();
};

export const DELETE: agentsDeleteRepoSecret = async ($) => {
  return $.response[204].empty();
};
