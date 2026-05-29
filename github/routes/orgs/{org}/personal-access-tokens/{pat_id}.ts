import type { orgsUpdatePatAccess } from "../../../../types/paths/orgs/{org}/personal-access-tokens/{pat_id}.types.js";

export const POST: orgsUpdatePatAccess = async ($) => {
  return $.response[204].empty();
};
