import type { actionsGetRepoPublicKey } from "../../../../../../types/paths/repos/{owner}/{repo}/actions/secrets/public-key.types.js";

export const GET: actionsGetRepoPublicKey = async ($) => {
  return $.response[200].random();
};
