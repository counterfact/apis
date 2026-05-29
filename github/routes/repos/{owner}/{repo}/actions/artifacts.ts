import type { actionsListArtifactsForRepo } from "../../../../../types/paths/repos/{owner}/{repo}/actions/artifacts.types.js";

export const GET: actionsListArtifactsForRepo = async ($) => {
  return $.response[200].random();
};
