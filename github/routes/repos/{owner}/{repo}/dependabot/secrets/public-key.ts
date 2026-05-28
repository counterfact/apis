import type { dependabotGetRepoPublicKey } from "../../../../../../types/paths/repos/{owner}/{repo}/dependabot/secrets/public-key.types.js";

export const GET: dependabotGetRepoPublicKey = async ($) => {
  return $.response[200].random();
};
