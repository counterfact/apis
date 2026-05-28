import type { gitCreateTree } from "../../../../../types/paths/repos/{owner}/{repo}/git/trees.types.js";

export const POST: gitCreateTree = async ($) => {
  return $.response[201].random();
};
