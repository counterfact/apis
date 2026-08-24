import type { orgsCancelInvitation } from "../../../../types/paths/orgs/{org}/invitations/{invitation_id}.types.js";

export const DELETE: orgsCancelInvitation = async ($) => {
  return $.context.cancelOrgInvitation($.path.org, $.path.invitation_id)
    ? $.response[204].empty()
    : $.response[404].json({ message: "Not Found", status: "404" });
};
