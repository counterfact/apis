import type { reposListCommentsForCommit } from "../../../../../../types/paths/repos/{owner}/{repo}/commits/{commit_sha}/comments.types.js";
import type { reposCreateCommitComment } from "../../../../../../types/paths/repos/{owner}/{repo}/commits/{commit_sha}/comments.types.js";

export const GET: reposListCommentsForCommit = async ($) => {
  return $.response[200].random();
};

export const POST: reposCreateCommitComment = async ($) => {
  return $.response[201].random();
};
