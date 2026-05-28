import type { orgsDeleteAttestationsBulk } from "../../../../types/paths/orgs/{org}/attestations/delete-request.types.js";

export const POST: orgsDeleteAttestationsBulk = async ($) => {
  return $.response[200].empty();
};
