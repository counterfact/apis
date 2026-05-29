import type { dependencyGraphDiffRange } from "../../../../../../types/paths/repos/{owner}/{repo}/dependency-graph/compare/{basehead}.types.js";

export const GET: dependencyGraphDiffRange = async ($) => {
  return $.response[200].random();
};
