import type { agentsListOrgSecrets } from "../../../../types/paths/orgs/{org}/agents/secrets.types.js";

export const GET: agentsListOrgSecrets = async ($) => {
  return $.response[200].random();
};
