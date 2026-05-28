import type { orgsCreateArtifactDeploymentRecord } from "../../../../../types/paths/orgs/{org}/artifacts/metadata/deployment-record.types.js";

export const POST: orgsCreateArtifactDeploymentRecord = async ($) => {
  return $.response[200].random();
};
