import type { oidcDeleteOidcCustomPropertyInclusionForOrg } from "../../../../../../../../types/paths/orgs/{org}/actions/oidc/customization/properties/repo/{custom_property_name}.types.js";

export const DELETE: oidcDeleteOidcCustomPropertyInclusionForOrg = async (
  $,
) => {
  return $.response[204].empty();
};
