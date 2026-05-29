import type {
  issuesCreateComment,
  issuesListComments,
} from "../../../../../../types/paths/repos/{owner}/{repo}/issues/{issue_number}/comments.types.js";

export const GET: issuesListComments = async ($) => {
  const issue = $.context.getIssue(
    $.path.owner,
    $.path.repo,
    $.path.issue_number,
  );
  if (!issue) {
    return $.response[404].empty();
  }
  return $.response[200].json(
    $.context.listIssueComments(
      $.path.owner,
      $.path.repo,
      $.path.issue_number,
      $.query,
    ),
  );
};

export const POST: issuesCreateComment = async ($) => {
  const issue = $.context.getIssue(
    $.path.owner,
    $.path.repo,
    $.path.issue_number,
  );
  if (!issue) {
    return $.response[404].empty();
  }

  const comment = $.context.saveIssueComment(
    $.path.owner,
    $.path.repo,
    $.path.issue_number,
    {
      body: $.body.body,
      user: $.context.getUser("octocat"),
    },
  );

  return $.response[201].json(comment);
};
