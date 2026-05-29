import type { orgsListForUser } from "../../../types/paths/users/{username}/orgs.types.js";

export const GET: orgsListForUser = async ($) => {
  return $.response[200].random();
};
