import type { issuesListComments } from "../../../../../../types/paths/repos/{owner}/{repo}/issues/{issue_number}/comments.types.js";
import type { issuesCreateComment } from "../../../../../../types/paths/repos/{owner}/{repo}/issues/{issue_number}/comments.types.js";

export const GET: issuesListComments = async ($) => {
  return $.response[200].random();
};

export const POST: issuesCreateComment = async ($) => {
  return $.response[201].random();
};
