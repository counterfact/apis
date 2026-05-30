import type { reposListCommitStatusesForRef } from "../../../../../../types/paths/repos/{owner}/{repo}/commits/{ref}/statuses.types.js";

export const GET: reposListCommitStatusesForRef = async ($) => {
  const { owner, repo, ref } = $.path;
  if (!$.context.hasRepository(owner, repo)) {
    return $.response[404].empty();
  }

  const commit = $.context.getCommit(owner, repo, ref);
  if (!commit) {
    return $.response[404].empty();
  }

  return $.response[200].json(
    $.context.listCommitStatuses(owner, repo, commit.sha),
  );
};
