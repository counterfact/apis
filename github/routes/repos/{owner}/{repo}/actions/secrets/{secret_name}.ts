import type { actionsGetRepoSecret } from "../../../../../../types/paths/repos/{owner}/{repo}/actions/secrets/{secret_name}.types.js";
import type { actionsCreateOrUpdateRepoSecret } from "../../../../../../types/paths/repos/{owner}/{repo}/actions/secrets/{secret_name}.types.js";
import type { actionsDeleteRepoSecret } from "../../../../../../types/paths/repos/{owner}/{repo}/actions/secrets/{secret_name}.types.js";

export const GET: actionsGetRepoSecret = async ($) => {
  return $.response[200].random();
};

export const PUT: actionsCreateOrUpdateRepoSecret = async ($) => {
  return $.response[201].random();
};

export const DELETE: actionsDeleteRepoSecret = async ($) => {
  return $.response[204].empty();
};
