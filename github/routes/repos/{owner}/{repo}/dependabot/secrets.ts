import type { dependabotListRepoSecrets } from "../../../../../types/paths/repos/{owner}/{repo}/dependabot/secrets.types.js";

export const GET: dependabotListRepoSecrets = async ($) => {
  return $.response[200].random();
};
