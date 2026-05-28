import type { orgsListPatGrantRequestRepositories } from "../../../../../types/paths/orgs/{org}/personal-access-token-requests/{pat_request_id}/repositories.types.js";

export const GET: orgsListPatGrantRequestRepositories = async ($) => {
  return $.response[200].random();
};
