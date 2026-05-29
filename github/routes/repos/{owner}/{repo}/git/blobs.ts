import type { gitCreateBlob } from "../../../../../types/paths/repos/{owner}/{repo}/git/blobs.types.js";

export const POST: gitCreateBlob = async ($) => {
  return $.response[201].random();
};
