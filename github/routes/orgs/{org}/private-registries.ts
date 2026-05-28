import type { privateRegistriesListOrgPrivateRegistries } from "../../../types/paths/orgs/{org}/private-registries.types.js";
import type { privateRegistriesCreateOrgPrivateRegistry } from "../../../types/paths/orgs/{org}/private-registries.types.js";

export const GET: privateRegistriesListOrgPrivateRegistries = async ($) => {
  return $.response[200].random();
};

export const POST: privateRegistriesCreateOrgPrivateRegistry = async ($) => {
  return $.response[201].random();
};
