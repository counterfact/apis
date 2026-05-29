import type { orgsListMembershipsForAuthenticatedUser } from "../../../types/paths/user/memberships/orgs.types.js";

export const GET: orgsListMembershipsForAuthenticatedUser = async ($) => {
  return $.response[200].random();
};
