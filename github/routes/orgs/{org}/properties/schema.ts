import type { orgsCustomPropertiesForReposGetOrganizationDefinitions } from "../../../../types/paths/orgs/{org}/properties/schema.types.js";
import type { orgsCustomPropertiesForReposCreateOrUpdateOrganizationDefinitions } from "../../../../types/paths/orgs/{org}/properties/schema.types.js";

export const GET: orgsCustomPropertiesForReposGetOrganizationDefinitions =
  async ($) => {
    return $.response[200].random();
  };

export const PATCH: orgsCustomPropertiesForReposCreateOrUpdateOrganizationDefinitions =
  async ($) => {
    return $.response[200].random();
  };
