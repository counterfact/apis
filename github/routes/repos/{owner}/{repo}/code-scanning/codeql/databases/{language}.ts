import type { codeScanningGetCodeqlDatabase } from "../../../../../../../types/paths/repos/{owner}/{repo}/code-scanning/codeql/databases/{language}.types.js";
import type { codeScanningDeleteCodeqlDatabase } from "../../../../../../../types/paths/repos/{owner}/{repo}/code-scanning/codeql/databases/{language}.types.js";

export const GET: codeScanningGetCodeqlDatabase = async ($) => {
  return $.response[200].random();
};

export const DELETE: codeScanningDeleteCodeqlDatabase = async ($) => {
  return $.response[204].empty();
};
