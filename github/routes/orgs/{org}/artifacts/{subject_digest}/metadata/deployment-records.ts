import type { orgsListArtifactDeploymentRecords } from "../../../../../../types/paths/orgs/{org}/artifacts/{subject_digest}/metadata/deployment-records.types.js";

export const GET: orgsListArtifactDeploymentRecords = async ($) => {
  return $.response[200].random();
};
