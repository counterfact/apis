import type { gitCreateRef } from "../../../../../types/paths/repos/{owner}/{repo}/git/refs.types.js";

export const POST: gitCreateRef = async ($) => {
  return $.response[201].random();
};
