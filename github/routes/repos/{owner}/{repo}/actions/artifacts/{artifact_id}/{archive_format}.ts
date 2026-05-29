import type { actionsDownloadArtifact } from "../../../../../../../types/paths/repos/{owner}/{repo}/actions/artifacts/{artifact_id}/{archive_format}.types.js";

export const GET: actionsDownloadArtifact = async ($) => {
  return $.response[302].empty();
};
