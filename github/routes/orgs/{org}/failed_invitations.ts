import type { orgsListFailedInvitations } from "../../../types/paths/orgs/{org}/failed_invitations.types.js";

export const GET: orgsListFailedInvitations = async ($) => {
  if (!$.context.getOrganization($.path.org)) {
    return $.response[404].json({ message: "Not Found", status: "404" });
  }
  return $.response[200].json(
    $.context.listFailedOrgInvitations($.path.org, $.query),
  );
};
