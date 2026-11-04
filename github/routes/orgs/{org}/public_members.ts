import type { orgsListPublicMembers } from "../../../types/paths/orgs/{org}/public_members.types.js";

export const GET: orgsListPublicMembers = async ($) => {
  return $.response[200].json($.context.listPublicMembers($.path.org, $.query));
};
