import type { reposListContributors } from "../../../../types/paths/repos/{owner}/{repo}/contributors.types.js";

export const GET: reposListContributors = async ($) => {
  return $.response[200].random();
};
