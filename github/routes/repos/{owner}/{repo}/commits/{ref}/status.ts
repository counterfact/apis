import type { reposGetCombinedStatusForRef } from "../../../../../../types/paths/repos/{owner}/{repo}/commits/{ref}/status.types.js";

export const GET: reposGetCombinedStatusForRef = async ($) => {
  return $.response[200].random();
};
