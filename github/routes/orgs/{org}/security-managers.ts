import type { orgsListSecurityManagerTeams } from "../../../types/paths/orgs/{org}/security-managers.types.js";

export const GET: orgsListSecurityManagerTeams = async ($) => {
  return $.response[200].random();
};
