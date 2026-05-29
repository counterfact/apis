import type { orgsListForAuthenticatedUser } from "../../types/paths/user/orgs.types.js";

export const GET: orgsListForAuthenticatedUser = async ($) => {
  return $.response[200].random();
};
