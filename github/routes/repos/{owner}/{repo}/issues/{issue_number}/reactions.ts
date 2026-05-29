import type { reactionsListForIssue } from "../../../../../../types/paths/repos/{owner}/{repo}/issues/{issue_number}/reactions.types.js";
import type { reactionsCreateForIssue } from "../../../../../../types/paths/repos/{owner}/{repo}/issues/{issue_number}/reactions.types.js";

export const GET: reactionsListForIssue = async ($) => {
  return $.response[200].random();
};

export const POST: reactionsCreateForIssue = async ($) => {
  return $.response[200].random();
};
