import type { orgsDeleteAttestationsBySubjectDigest } from "../../../../../types/paths/orgs/{org}/attestations/digest/{subject_digest}.types.js";

export const DELETE: orgsDeleteAttestationsBySubjectDigest = async ($) => {
  return $.response[200].empty();
};
