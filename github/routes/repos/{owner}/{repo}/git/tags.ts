import type { gitCreateTag } from "../../../../../types/paths/repos/{owner}/{repo}/git/tags.types.js";

export const POST: gitCreateTag = async ($) => {
  return $.response[201].random();
};
