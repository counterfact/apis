import type { dependencyGraphCreateRepositorySnapshot } from "../../../../../types/paths/repos/{owner}/{repo}/dependency-graph/snapshots.types.js";

export const POST: dependencyGraphCreateRepositorySnapshot = async ($) => {
  return $.response[201].random();
};
