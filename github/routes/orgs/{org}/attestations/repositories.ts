import type { orgsListAttestationRepositories } from "../../../../types/paths/orgs/{org}/attestations/repositories.types.js";

export const GET: orgsListAttestationRepositories = async ($) => {
  return $.response[200].random();
};
