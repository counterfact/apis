import type { reposListCommitStatusesForRef } from "../../../../../../types/paths/repos/{owner}/{repo}/commits/{ref}/statuses.types.js";

export const GET: reposListCommitStatusesForRef = async ($) => {
  return $.response[200].random();
};
