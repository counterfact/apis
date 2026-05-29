import type { reposMerge } from "../../../../types/paths/repos/{owner}/{repo}/merges.types.js";

export const POST: reposMerge = async ($) => {
  return $.response[201].random();
};
