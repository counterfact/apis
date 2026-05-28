import type { oidcGetOidcCustomSubTemplateForOrg } from "../../../../../../types/paths/orgs/{org}/actions/oidc/customization/sub.types.js";
import type { oidcUpdateOidcCustomSubTemplateForOrg } from "../../../../../../types/paths/orgs/{org}/actions/oidc/customization/sub.types.js";

export const GET: oidcGetOidcCustomSubTemplateForOrg = async ($) => {
  return $.response[200].random();
};

export const PUT: oidcUpdateOidcCustomSubTemplateForOrg = async ($) => {
  return $.response[201].random();
};
