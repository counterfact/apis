import type { orgsListInvitationTeams } from "../../../../../types/paths/orgs/{org}/invitations/{invitation_id}/teams.types.js";

export const GET: orgsListInvitationTeams = async ($) => {
  return $.response[200].random();
};
