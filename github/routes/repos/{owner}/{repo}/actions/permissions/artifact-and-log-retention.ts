import type { actionsGetArtifactAndLogRetentionSettingsRepository } from "../../../../../../types/paths/repos/{owner}/{repo}/actions/permissions/artifact-and-log-retention.types.js";
import type { actionsSetArtifactAndLogRetentionSettingsRepository } from "../../../../../../types/paths/repos/{owner}/{repo}/actions/permissions/artifact-and-log-retention.types.js";

export const GET: actionsGetArtifactAndLogRetentionSettingsRepository = async (
  $,
) => {
  return $.response[200].random();
};

export const PUT: actionsSetArtifactAndLogRetentionSettingsRepository = async (
  $,
) => {
  return $.response[204].empty();
};
