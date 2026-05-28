import type { orgsListArtifactStorageRecords } from "../../../../../../types/paths/orgs/{org}/artifacts/{subject_digest}/metadata/storage-records.types.js";

export const GET: orgsListArtifactStorageRecords = async ($) => {
  return $.response[200].random();
};
