import type { reposGetCommit } from "../../../../../types/paths/repos/{owner}/{repo}/commits/{ref}.types.js";

export const GET: reposGetCommit = async ($) => {
  const { owner, repo, ref } = $.path;
  if (!$.context.hasRepository(owner, repo)) {
    return $.response[404].empty();
  }

  const commit = $.context.getCommit(owner, repo, ref);
  if (!commit) {
    return $.response[404].empty();
  }

  return $.response[200].json(commit);
};
