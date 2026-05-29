import type { orgsListPatGrantRepositories } from "../../../../../types/paths/orgs/{org}/personal-access-tokens/{pat_id}/repositories.types.js";

export const GET: orgsListPatGrantRepositories = async ($) => {
  return $.response[200].random();
};
