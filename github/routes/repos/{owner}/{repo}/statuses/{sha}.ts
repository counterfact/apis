import type { reposCreateCommitStatus } from "../../../../../types/paths/repos/{owner}/{repo}/statuses/{sha}.types.js";

export const POST: reposCreateCommitStatus = async ($) => {
  return $.response[201].random();
};
