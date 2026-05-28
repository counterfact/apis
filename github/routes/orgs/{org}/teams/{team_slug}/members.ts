import type { teamsListMembersInOrg } from "../../../../../types/paths/orgs/{org}/teams/{team_slug}/members.types.js";

export const GET: teamsListMembersInOrg = async ($) => {
  return $.response[200].random();
};
