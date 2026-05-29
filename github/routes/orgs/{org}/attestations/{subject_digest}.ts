import type { orgsListAttestations } from "../../../../types/paths/orgs/{org}/attestations/{subject_digest}.types.js";

export const GET: orgsListAttestations = async ($) => {
  return $.response[200].random();
};
