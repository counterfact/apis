import type { gitGetTree } from "../../../../../../types/paths/repos/{owner}/{repo}/git/trees/{tree_sha}.types.js";

export const GET: gitGetTree = async ($) => {
  return $.response[200].random();
};
