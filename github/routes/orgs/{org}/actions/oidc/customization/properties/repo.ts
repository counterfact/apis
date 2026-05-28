import type { oidcListOidcCustomPropertyInclusionsForOrg } from "../../../../../../../types/paths/orgs/{org}/actions/oidc/customization/properties/repo.types.js";
import type { oidcCreateOidcCustomPropertyInclusionForOrg } from "../../../../../../../types/paths/orgs/{org}/actions/oidc/customization/properties/repo.types.js";

export const GET: oidcListOidcCustomPropertyInclusionsForOrg = async ($) => {
  return $.response[200].random();
};

export const POST: oidcCreateOidcCustomPropertyInclusionForOrg = async ($) => {
  return $.response[201].random();
};
