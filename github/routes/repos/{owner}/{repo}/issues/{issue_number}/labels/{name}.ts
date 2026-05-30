import type { issuesRemoveLabel } from "../../../../../../../types/paths/repos/{owner}/{repo}/issues/{issue_number}/labels/{name}.types.js";

export const DELETE: issuesRemoveLabel = async ($) => {
  if (!$.context.hasRepository($.path.owner, $.path.repo)) {
    return $.response[404].empty();
  }

  if (!$.context.getIssue($.path.owner, $.path.repo, $.path.issue_number)) {
    return $.response[404].empty();
  }

  if (
    !$.context.removeLabelFromIssue(
      $.path.owner,
      $.path.repo,
      $.path.issue_number,
      $.path.name,
    )
  ) {
    return $.response[404].empty();
  }

  return $.response[200].json(
    $.context.listIssueLabels(
      $.path.owner,
      $.path.repo,
      $.path.issue_number,
    ),
  );
};
