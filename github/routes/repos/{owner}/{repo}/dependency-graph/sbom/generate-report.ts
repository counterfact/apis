import type { dependencyGraphGenerateSbomReport } from "../../../../../../types/paths/repos/{owner}/{repo}/dependency-graph/sbom/generate-report.types.js";

export const GET: dependencyGraphGenerateSbomReport = async ($) => {
  return $.response[201].random();
};
