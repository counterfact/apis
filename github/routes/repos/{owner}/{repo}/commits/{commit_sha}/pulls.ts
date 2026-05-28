import type { reposListPullRequestsAssociatedWithCommit } from "../../../../../../types/paths/repos/{owner}/{repo}/commits/{commit_sha}/pulls.types.js";

export const GET: reposListPullRequestsAssociatedWithCommit = async ($) => {
  return $.response[200].random();
};
