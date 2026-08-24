import type { orgsListInvitationTeams } from "../../../../../types/paths/orgs/{org}/invitations/{invitation_id}/teams.types.js";

export const GET: orgsListInvitationTeams = async ($) => {
  const invitation = $.context
    .listOrgInvitations($.path.org)
    .find(({ id }) => id === $.path.invitation_id);
  if (!$.context.getOrganization($.path.org) || !invitation) {
    return $.response[404].json({ message: "Not Found", status: "404" });
  }
  return $.response[200].json(
    $.context.listOrgInvitationTeams($.path.org, $.path.invitation_id, $.query),
  );
};
