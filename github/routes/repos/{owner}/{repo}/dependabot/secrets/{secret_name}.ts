import type { dependabotGetRepoSecret } from "../../../../../../types/paths/repos/{owner}/{repo}/dependabot/secrets/{secret_name}.types.js";
import type { dependabotCreateOrUpdateRepoSecret } from "../../../../../../types/paths/repos/{owner}/{repo}/dependabot/secrets/{secret_name}.types.js";
import type { dependabotDeleteRepoSecret } from "../../../../../../types/paths/repos/{owner}/{repo}/dependabot/secrets/{secret_name}.types.js";

export const GET: dependabotGetRepoSecret = async ($) => {
  return $.response[200].random();
};

export const PUT: dependabotCreateOrUpdateRepoSecret = async ($) => {
  return $.response[201].random();
};

export const DELETE: dependabotDeleteRepoSecret = async ($) => {
  return $.response[204].empty();
};
