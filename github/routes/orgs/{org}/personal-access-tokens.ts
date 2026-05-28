import type { orgsListPatGrants } from "../../../types/paths/orgs/{org}/personal-access-tokens.types.js";
import type { orgsUpdatePatAccesses } from "../../../types/paths/orgs/{org}/personal-access-tokens.types.js";

export const GET: orgsListPatGrants = async ($) => {
  return $.response[200].random();
};

export const POST: orgsUpdatePatAccesses = async ($) => {
  return $.response[202].empty();
};
