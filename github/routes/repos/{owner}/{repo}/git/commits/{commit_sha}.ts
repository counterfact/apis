import type { gitGetCommit } from "../../../../../../types/paths/repos/{owner}/{repo}/git/commits/{commit_sha}.types.js";

export const GET: gitGetCommit = async ($) => {
  return $.response[200].random();
};
