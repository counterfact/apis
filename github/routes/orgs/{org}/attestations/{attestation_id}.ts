import type { orgsDeleteAttestationsById } from "../../../../types/paths/orgs/{org}/attestations/{attestation_id}.types.js";

export const DELETE: orgsDeleteAttestationsById = async ($) => {
  return $.response[200].empty();
};
