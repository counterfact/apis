import type { privateRegistriesGetOrgPublicKey } from "../../../../types/paths/orgs/{org}/private-registries/public-key.types.js";

export const GET: privateRegistriesGetOrgPublicKey = async ($) => {
  return $.response[200].random();
};
