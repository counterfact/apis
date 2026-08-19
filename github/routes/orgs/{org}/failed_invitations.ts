import type { orgsListFailedInvitations } from "../../../types/paths/orgs/{org}/failed_invitations.types.js";

export const GET: orgsListFailedInvitations = async ($) => {
  return $.response[200].json(
    $.context.listFailedOrgInvitations($.path.org, $.query),
  );
};
