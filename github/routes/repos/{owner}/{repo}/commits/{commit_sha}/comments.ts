import type { reposListCommentsForCommit } from "../../../../../../types/paths/repos/{owner}/{repo}/commits/{commit_sha}/comments.types.js";
import type { reposCreateCommitComment } from "../../../../../../types/paths/repos/{owner}/{repo}/commits/{commit_sha}/comments.types.js";

export const GET: reposListCommentsForCommit = async ($) => {
  const { owner, repo, commit_sha } = $.path;
  if (!$.context.hasRepository(owner, repo)) {
    return $.response[404].empty();
  }

  const commit = $.context.getCommit(owner, repo, commit_sha);
  if (!commit) {
    return $.response[404].empty();
  }

  return $.response[200].json(
    $.context.listCommitComments(owner, repo, commit.sha),
  );
};

export const POST: reposCreateCommitComment = async ($) => {
  const { owner, repo, commit_sha } = $.path;
  if (!$.context.hasRepository(owner, repo)) {
    return $.response[404].empty();
  }

  const commit = $.context.getCommit(owner, repo, commit_sha);
  if (!commit) {
    return $.response[404].empty();
  }

  const comment = $.context.saveCommitComment(owner, repo, commit.sha, {
    body: $.body.body,
    path: $.body.path,
    line: $.body.line ?? $.body.position,
  });

  return $.response[201].json(comment);
};
