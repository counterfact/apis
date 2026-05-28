import type { orgsListBlockedUsers } from "../../../types/paths/orgs/{org}/blocks.types.js";

export const GET: orgsListBlockedUsers = async ($) => {
  return $.response[200].random();
};
