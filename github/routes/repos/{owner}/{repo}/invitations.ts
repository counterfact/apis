import type { reposListInvitations } from "../../../../types/paths/repos/{owner}/{repo}/invitations.types.js";

export const GET: reposListInvitations = async ($) => {
  return $.response[200].random();
};
