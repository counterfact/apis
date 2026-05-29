import type { actionsGetCustomOidcSubClaimForRepo } from "../../../../../../../types/paths/repos/{owner}/{repo}/actions/oidc/customization/sub.types.js";
import type { actionsSetCustomOidcSubClaimForRepo } from "../../../../../../../types/paths/repos/{owner}/{repo}/actions/oidc/customization/sub.types.js";

export const GET: actionsGetCustomOidcSubClaimForRepo = async ($) => {
  return $.response[200].random();
};

export const PUT: actionsSetCustomOidcSubClaimForRepo = async ($) => {
  return $.response[201].random();
};
