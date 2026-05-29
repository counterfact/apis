import type { orgsList } from "../types/paths/organizations.types.js";

export const GET: orgsList = async ($) => {
  return $.response[200].json($.context.listSimpleOrganizations($.query));
};
