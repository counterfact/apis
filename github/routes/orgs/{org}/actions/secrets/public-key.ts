import type { actionsGetOrgPublicKey } from "../../../../../types/paths/orgs/{org}/actions/secrets/public-key.types.js";

export const GET: actionsGetOrgPublicKey = async ($) => {
  return $.response[200].random();
};
