import type { orgsListPendingInvitations } from "../../../types/paths/orgs/{org}/invitations.types.js";
import type { orgsCreateInvitation } from "../../../types/paths/orgs/{org}/invitations.types.js";

export const GET: orgsListPendingInvitations = async ($) => {
  if (!$.context.getOrganization($.path.org)) {
    return $.response[404].json({ message: "Not Found", status: "404" });
  }
  return $.response[200].json(
    $.context.listOrgInvitations($.path.org, $.query),
  );
};

export const POST: orgsCreateInvitation = async ($) => {
  if (!$.context.getOrganization($.path.org)) {
    return $.response[404].json({ message: "Not Found", status: "404" });
  }
  return $.response[201].json(
    $.context.createOrgInvitation($.path.org, $.body),
  );
};
