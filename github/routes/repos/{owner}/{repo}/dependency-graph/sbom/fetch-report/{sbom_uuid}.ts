import type { dependencyGraphFetchSbomReport } from "../../../../../../../types/paths/repos/{owner}/{repo}/dependency-graph/sbom/fetch-report/{sbom_uuid}.types.js";

export const GET: dependencyGraphFetchSbomReport = async ($) => {
  return $.response[202].empty();
};
