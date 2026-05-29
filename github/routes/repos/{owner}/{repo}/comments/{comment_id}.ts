import type { reposGetCommitComment } from "../../../../../types/paths/repos/{owner}/{repo}/comments/{comment_id}.types.js";
import type { reposUpdateCommitComment } from "../../../../../types/paths/repos/{owner}/{repo}/comments/{comment_id}.types.js";
import type { reposDeleteCommitComment } from "../../../../../types/paths/repos/{owner}/{repo}/comments/{comment_id}.types.js";

export const GET: reposGetCommitComment = async ($) => {
  return $.response[200].random();
};

export const PATCH: reposUpdateCommitComment = async ($) => {
  return $.response[200].random();
};

export const DELETE: reposDeleteCommitComment = async ($) => {
  return $.response[204].empty();
};
