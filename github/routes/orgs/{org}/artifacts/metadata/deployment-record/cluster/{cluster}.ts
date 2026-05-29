import type { orgsSetClusterDeploymentRecords } from "../../../../../../../types/paths/orgs/{org}/artifacts/metadata/deployment-record/cluster/{cluster}.types.js";

export const POST: orgsSetClusterDeploymentRecords = async ($) => {
  return $.response[200].random();
};
