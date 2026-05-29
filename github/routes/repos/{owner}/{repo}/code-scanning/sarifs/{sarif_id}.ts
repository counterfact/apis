import type { codeScanningGetSarif } from "../../../../../../types/paths/repos/{owner}/{repo}/code-scanning/sarifs/{sarif_id}.types.js";

export const GET: codeScanningGetSarif = async ($) => {
  return $.response[200].random();
};
