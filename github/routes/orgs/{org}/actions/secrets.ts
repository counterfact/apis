import type { actionsListOrgSecrets } from "../../../../types/paths/orgs/{org}/actions/secrets.types.js";

export const GET: actionsListOrgSecrets = async ($) => {
  return $.response[200].random();
};
