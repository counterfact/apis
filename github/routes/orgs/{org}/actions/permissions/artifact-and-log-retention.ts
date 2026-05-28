import type { actionsGetArtifactAndLogRetentionSettingsOrganization } from "../../../../../types/paths/orgs/{org}/actions/permissions/artifact-and-log-retention.types.js";
import type { actionsSetArtifactAndLogRetentionSettingsOrganization } from "../../../../../types/paths/orgs/{org}/actions/permissions/artifact-and-log-retention.types.js";

export const GET: actionsGetArtifactAndLogRetentionSettingsOrganization =
  async ($) => {
    return $.response[200].random();
  };

export const PUT: actionsSetArtifactAndLogRetentionSettingsOrganization =
  async ($) => {
    return $.response[204].empty();
  };
