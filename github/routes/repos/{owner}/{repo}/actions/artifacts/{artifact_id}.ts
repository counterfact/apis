import type { actionsGetArtifact } from "../../../../../../types/paths/repos/{owner}/{repo}/actions/artifacts/{artifact_id}.types.js";
import type { actionsDeleteArtifact } from "../../../../../../types/paths/repos/{owner}/{repo}/actions/artifacts/{artifact_id}.types.js";

export const GET: actionsGetArtifact = async ($) => {
  return $.response[200].random();
};

export const DELETE: actionsDeleteArtifact = async ($) => {
  return $.response[204].empty();
};
