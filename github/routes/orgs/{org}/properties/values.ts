import type { orgsCustomPropertiesForReposGetOrganizationValues } from "../../../../types/paths/orgs/{org}/properties/values.types.js";
import type { orgsCustomPropertiesForReposCreateOrUpdateOrganizationValues } from "../../../../types/paths/orgs/{org}/properties/values.types.js";

export const GET: orgsCustomPropertiesForReposGetOrganizationValues = async (
  $,
) => {
  return $.response[200].random();
};

export const PATCH: orgsCustomPropertiesForReposCreateOrUpdateOrganizationValues =
  async ($) => {
    return $.response[204].empty();
  };
