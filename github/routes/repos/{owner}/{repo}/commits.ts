import type { reposListCommits } from "../../../../types/paths/repos/{owner}/{repo}/commits.types.js";

export const GET: reposListCommits = async ($) => {
  const { owner, repo } = $.path;
  if (!$.context.hasRepository(owner, repo)) {
    return $.response[404].empty();
  }
  return $.response[200].json($.context.listCommits(owner, repo, $.query));
};
