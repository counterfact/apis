import type { privateRegistriesGetOrgPrivateRegistry } from "../../../../types/paths/orgs/{org}/private-registries/{secret_name}.types.js";
import type { privateRegistriesUpdateOrgPrivateRegistry } from "../../../../types/paths/orgs/{org}/private-registries/{secret_name}.types.js";
import type { privateRegistriesDeleteOrgPrivateRegistry } from "../../../../types/paths/orgs/{org}/private-registries/{secret_name}.types.js";

export const GET: privateRegistriesGetOrgPrivateRegistry = async ($) => {
  return $.response[200].random();
};

export const PATCH: privateRegistriesUpdateOrgPrivateRegistry = async ($) => {
  return $.response[204].empty();
};

export const DELETE: privateRegistriesDeleteOrgPrivateRegistry = async ($) => {
  return $.response[204].empty();
};
