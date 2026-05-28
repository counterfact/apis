import type { reposUpdateInvitation } from "../../../../../types/paths/repos/{owner}/{repo}/invitations/{invitation_id}.types.js";
import type { reposDeleteInvitation } from "../../../../../types/paths/repos/{owner}/{repo}/invitations/{invitation_id}.types.js";

export const PATCH: reposUpdateInvitation = async ($) => {
  return $.response[200].random();
};

export const DELETE: reposDeleteInvitation = async ($) => {
  return $.response[204].empty();
};
