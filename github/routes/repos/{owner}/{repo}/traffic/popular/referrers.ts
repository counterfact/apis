import type { reposGetTopReferrers } from "../../../../../../types/paths/repos/{owner}/{repo}/traffic/popular/referrers.types.js";

export const GET: reposGetTopReferrers = async ($) => {
  return $.response[200].random();
};
