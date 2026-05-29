import type {
  issuesGet,
  issuesUpdate,
} from "../../../../../types/paths/repos/{owner}/{repo}/issues/{issue_number}.types.js";

export const GET: issuesGet = async ($) => {
  const issue = $.context.getIssue($.path.owner, $.path.repo, $.path.issue_number);
  if (!issue) {
    return $.response[404].empty();
  }
  return $.response[200].json(issue);
};

export const PATCH: issuesUpdate = async ($) => {
  const existing = $.context.getIssue($.path.owner, $.path.repo, $.path.issue_number);
  if (!existing) {
    return $.response[404].empty();
  }

  const issue = $.context.saveIssue($.path.owner, $.path.repo, {
    ...existing,
    number: $.path.issue_number,
    title: $.body.title ?? existing.title,
    body: $.body.body ?? existing.body,
    state: $.body.state ?? existing.state,
    state_reason: $.body.state_reason ?? existing.state_reason,
    labels: $.body.labels ?? existing.labels,
  });

  return $.response[200].json(issue);
};
