import type { reposListReleases } from "../../../../types/paths/repos/{owner}/{repo}/releases.types.js";
import type { reposCreateRelease } from "../../../../types/paths/repos/{owner}/{repo}/releases.types.js";

export const GET: reposListReleases = async ($) => {
  const { owner, repo } = $.path;
  if (!$.context.hasRepository(owner, repo)) {
    return $.response[404].json({ message: "Not Found" });
  }
  return $.response[200].json($.context.listReleases(owner, repo, $.query));
};

export const POST: reposCreateRelease = async ($) => {
  const { owner, repo } = $.path;
  if (!$.context.hasRepository(owner, repo)) {
    return $.response[404].json({ message: "Not Found" });
  }
  const created = $.context.saveRelease(owner, repo, $.body);
  return $.response[201].json(created);
};
