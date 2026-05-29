import type { orgsEnableOrDisableSecurityProductOnAllOrgRepos } from "../../../../types/paths/orgs/{org}/{security_product}/{enablement}.types.js";

export const POST: orgsEnableOrDisableSecurityProductOnAllOrgRepos = async (
  $,
) => {
  return $.response[204].empty();
};
