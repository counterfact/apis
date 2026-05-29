import type { oidcListOidcCustomPropertyInclusionsForEnterprise } from "../../../../../../../types/paths/enterprises/{enterprise}/actions/oidc/customization/properties/repo.types.js";
import type { oidcCreateOidcCustomPropertyInclusionForEnterprise } from "../../../../../../../types/paths/enterprises/{enterprise}/actions/oidc/customization/properties/repo.types.js";

export const GET: oidcListOidcCustomPropertyInclusionsForEnterprise = async (
  $,
) => {
  return $.response[200].random();
};

export const POST: oidcCreateOidcCustomPropertyInclusionForEnterprise = async (
  $,
) => {
  return $.response[201].random();
};
