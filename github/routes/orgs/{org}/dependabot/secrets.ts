import type { dependabotListOrgSecrets } from "../../../../types/paths/orgs/{org}/dependabot/secrets.types.js";

export const GET: dependabotListOrgSecrets = async ($) => {
  return $.response[200].random();
};
