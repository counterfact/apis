import type { agentsGetOrgPublicKey } from "../../../../../types/paths/orgs/{org}/agents/secrets/public-key.types.js";

export const GET: agentsGetOrgPublicKey = async ($) => {
  return $.response[200].random();
};
