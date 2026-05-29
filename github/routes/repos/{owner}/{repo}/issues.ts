import type {
  issuesCreate,
  issuesListForRepo,
} from "../../../../types/paths/repos/{owner}/{repo}/issues.types.js";

export const GET: issuesListForRepo = async ($) => {
  if (!$.context.hasRepository($.path.owner, $.path.repo)) {
    return $.response[404].empty();
  }
  return $.response[200].json(
    $.context.listIssues($.path.owner, $.path.repo, $.query),
  );
};

export const POST: issuesCreate = async ($) => {
  if (!$.context.hasRepository($.path.owner, $.path.repo)) {
    return $.response[404].empty();
  }

  const issue = $.context.saveIssue($.path.owner, $.path.repo, {
    title: $.body.title,
    body: $.body.body,
    labels: $.body.labels,
    user: $.context.getUser("octocat"),
  });

  return $.response[201].json(issue);
};
