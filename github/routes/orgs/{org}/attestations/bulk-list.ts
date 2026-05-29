import type { orgsListAttestationsBulk } from "../../../../types/paths/orgs/{org}/attestations/bulk-list.types.js";

export const POST: orgsListAttestationsBulk = async ($) => {
  return $.response[200].random();
};
