import type { reposGetCombinedStatusForRef } from "../../../../../../types/paths/repos/{owner}/{repo}/commits/{ref}/status.types.js";

export const GET: reposGetCombinedStatusForRef = async ($) => {
  const { owner, repo, ref } = $.path;
  if (!$.context.hasRepository(owner, repo)) {
    return $.response[404].empty();
  }

  const status = $.context.getCombinedStatus(owner, repo, ref);
  if (!status) {
    return $.response[404].empty();
  }

  return $.response[200].json(status);
};
