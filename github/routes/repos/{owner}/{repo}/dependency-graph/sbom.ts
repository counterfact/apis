import type { dependencyGraphExportSbom } from "../../../../../types/paths/repos/{owner}/{repo}/dependency-graph/sbom.types.js";

export const GET: dependencyGraphExportSbom = async ($) => {
  return $.response[200].random();
};
