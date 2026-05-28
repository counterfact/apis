import type { orgsListPatGrantRequests } from "../../../types/paths/orgs/{org}/personal-access-token-requests.types.js";
import type { orgsReviewPatGrantRequestsInBulk } from "../../../types/paths/orgs/{org}/personal-access-token-requests.types.js";

export const GET: orgsListPatGrantRequests = async ($) => {
  return $.response[200].random();
};

export const POST: orgsReviewPatGrantRequestsInBulk = async ($) => {
  return $.response[202].empty();
};
