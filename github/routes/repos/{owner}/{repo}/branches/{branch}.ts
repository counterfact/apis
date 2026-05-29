import type { reposGetBranch } from "../../../../../types/paths/repos/{owner}/{repo}/branches/{branch}.types.js";

export const GET: reposGetBranch = async ($) => {
  const branch = $.context.getRepositoryBranch(
    $.path.owner,
    $.path.repo,
    $.path.branch,
  );
  if (!branch) {
    return $.response[404].empty();
  }
  return $.response[200].json(branch);
};
