import type { orgsListPendingInvitations } from "../../../types/paths/orgs/{org}/invitations.types.js";
import type { orgsCreateInvitation } from "../../../types/paths/orgs/{org}/invitations.types.js";

export const GET: orgsListPendingInvitations = async ($) => {
  return $.response[200].random();
};

export const POST: orgsCreateInvitation = async ($) => {
  return $.response[201].random();
};
