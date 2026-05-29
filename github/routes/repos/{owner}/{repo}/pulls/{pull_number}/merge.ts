import type { pullsCheckIfMerged } from "../../../../../../types/paths/repos/{owner}/{repo}/pulls/{pull_number}/merge.types.js";
import type { pullsMerge } from "../../../../../../types/paths/repos/{owner}/{repo}/pulls/{pull_number}/merge.types.js";

export const GET: pullsCheckIfMerged = async ($) => {
  return $.response[204].empty();
};

export const PUT: pullsMerge = async ($) => {
  return $.response[200].random();
};
