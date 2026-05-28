import type { oidcDeleteOidcCustomPropertyInclusionForEnterprise } from "../../../../../../../../types/paths/enterprises/{enterprise}/actions/oidc/customization/properties/repo/{custom_property_name}.types.js";

export const DELETE: oidcDeleteOidcCustomPropertyInclusionForEnterprise =
  async ($) => {
    return $.response[204].empty();
  };
