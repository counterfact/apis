import type { reposListInvitationsForAuthenticatedUser } from "../../types/paths/user/repository_invitations.types.js";

export const GET: reposListInvitationsForAuthenticatedUser = async ($) => {
  return $.response[200].random();
};
