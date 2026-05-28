import type { reposListBranchesForHeadCommit } from "../../../../../../types/paths/repos/{owner}/{repo}/commits/{commit_sha}/branches-where-head.types.js";

export const GET: reposListBranchesForHeadCommit = async ($) => {
  return $.response[200].random();
};
