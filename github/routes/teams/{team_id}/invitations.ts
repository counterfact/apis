import type { teamsListPendingInvitationsLegacy } from "../../../types/paths/teams/{team_id}/invitations.types.js";

export const GET: teamsListPendingInvitationsLegacy = async ($) => {
  return $.response[200].random();
};
