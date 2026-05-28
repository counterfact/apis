import type { orgsCancelInvitation } from "../../../../types/paths/orgs/{org}/invitations/{invitation_id}.types.js";

export const DELETE: orgsCancelInvitation = async ($) => {
  return $.response[204].empty();
};
