import type { issuesGetComment } from "../../../../../../types/paths/repos/{owner}/{repo}/issues/comments/{comment_id}.types.js";
import type { issuesUpdateComment } from "../../../../../../types/paths/repos/{owner}/{repo}/issues/comments/{comment_id}.types.js";
import type { issuesDeleteComment } from "../../../../../../types/paths/repos/{owner}/{repo}/issues/comments/{comment_id}.types.js";

export const GET: issuesGetComment = async ($) => {
  return $.response[200].random();
};

export const PATCH: issuesUpdateComment = async ($) => {
  return $.response[200].random();
};

export const DELETE: issuesDeleteComment = async ($) => {
  return $.response[204].empty();
};
