import type { codeScanningUploadSarif } from "../../../../../types/paths/repos/{owner}/{repo}/code-scanning/sarifs.types.js";

export const POST: codeScanningUploadSarif = async ($) => {
  return $.response[202].random();
};
