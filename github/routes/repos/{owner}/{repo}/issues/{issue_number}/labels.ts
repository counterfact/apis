import type { issuesListLabelsOnIssue } from "../../../../../../types/paths/repos/{owner}/{repo}/issues/{issue_number}/labels.types.js";
import type { issuesAddLabels } from "../../../../../../types/paths/repos/{owner}/{repo}/issues/{issue_number}/labels.types.js";
import type { issuesSetLabels } from "../../../../../../types/paths/repos/{owner}/{repo}/issues/{issue_number}/labels.types.js";
import type { issuesRemoveAllLabels } from "../../../../../../types/paths/repos/{owner}/{repo}/issues/{issue_number}/labels.types.js";

export const GET: issuesListLabelsOnIssue = async ($) => {
  return $.response[200].random();
};

export const POST: issuesAddLabels = async ($) => {
  return $.response[200].random();
};

export const PUT: issuesSetLabels = async ($) => {
  return $.response[200].random();
};

export const DELETE: issuesRemoveAllLabels = async ($) => {
  return $.response[204].empty();
};
