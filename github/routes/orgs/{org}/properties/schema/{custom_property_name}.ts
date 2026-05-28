import type { orgsCustomPropertiesForReposGetOrganizationDefinition } from "../../../../../types/paths/orgs/{org}/properties/schema/{custom_property_name}.types.js";
import type { orgsCustomPropertiesForReposCreateOrUpdateOrganizationDefinition } from "../../../../../types/paths/orgs/{org}/properties/schema/{custom_property_name}.types.js";
import type { orgsCustomPropertiesForReposDeleteOrganizationDefinition } from "../../../../../types/paths/orgs/{org}/properties/schema/{custom_property_name}.types.js";

export const GET: orgsCustomPropertiesForReposGetOrganizationDefinition =
  async ($) => {
    return $.response[200].random();
  };

export const PUT: orgsCustomPropertiesForReposCreateOrUpdateOrganizationDefinition =
  async ($) => {
    return $.response[200].random();
  };

export const DELETE: orgsCustomPropertiesForReposDeleteOrganizationDefinition =
  async ($) => {
    return $.response[204].empty();
  };
