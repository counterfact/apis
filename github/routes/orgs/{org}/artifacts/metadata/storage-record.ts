import type { orgsCreateArtifactStorageRecord } from "../../../../../types/paths/orgs/{org}/artifacts/metadata/storage-record.types.js";

export const POST: orgsCreateArtifactStorageRecord = async ($) => {
  return $.response[200].random();
};
