import type { agentsGetRepoPublicKey } from "../../../../../../types/paths/repos/{owner}/{repo}/agents/secrets/public-key.types.js";

export const GET: agentsGetRepoPublicKey = async ($) => {
  return $.response[200].random();
};
