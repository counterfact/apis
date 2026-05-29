import type { orgsReviewPatGrantRequest } from "../../../../types/paths/orgs/{org}/personal-access-token-requests/{pat_request_id}.types.js";

export const POST: orgsReviewPatGrantRequest = async ($) => {
  return $.response[204].empty();
};
