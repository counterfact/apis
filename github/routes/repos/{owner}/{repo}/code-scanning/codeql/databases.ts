import type { codeScanningListCodeqlDatabases } from "../../../../../../types/paths/repos/{owner}/{repo}/code-scanning/codeql/databases.types.js";

export const GET: codeScanningListCodeqlDatabases = async ($) => {
  return $.response[200].random();
};
