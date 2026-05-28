import type { reposAcceptInvitationForAuthenticatedUser } from "../../../types/paths/user/repository_invitations/{invitation_id}.types.js";
import type { reposDeclineInvitationForAuthenticatedUser } from "../../../types/paths/user/repository_invitations/{invitation_id}.types.js";

export const PATCH: reposAcceptInvitationForAuthenticatedUser = async ($) => {
  return $.response[204].empty();
};

export const DELETE: reposDeclineInvitationForAuthenticatedUser = async ($) => {
  return $.response[204].empty();
};
