import type { orgsListMembers } from "../../../types/paths/orgs/{org}/members.types.js";

export const GET: orgsListMembers = async ($) => {
  return $.response[200].json($.context.listOrgMembers($.path.org, $.query));
};
