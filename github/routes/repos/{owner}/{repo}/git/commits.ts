import type { gitCreateCommit } from "../../../../../types/paths/repos/{owner}/{repo}/git/commits.types.js";

export const POST: gitCreateCommit = async ($) => {
  return $.response[201].random();
};
