import type { dependabotGetOrgPublicKey } from "../../../../../types/paths/orgs/{org}/dependabot/secrets/public-key.types.js";

export const GET: dependabotGetOrgPublicKey = async ($) => {
  return $.response[200].random();
};
