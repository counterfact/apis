import type { teamsListPendingInvitationsInOrg } from "../../../../../types/paths/orgs/{org}/teams/{team_slug}/invitations.types.js";

export const GET: teamsListPendingInvitationsInOrg = async ($) => {
  return $.response[200].random();
};
