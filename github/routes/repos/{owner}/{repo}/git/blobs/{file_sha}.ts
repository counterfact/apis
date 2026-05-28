import type { gitGetBlob } from "../../../../../../types/paths/repos/{owner}/{repo}/git/blobs/{file_sha}.types.js";

export const GET: gitGetBlob = async ($) => {
  return $.response[200].random();
};
