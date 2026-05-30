import type { reposGetLatestRelease } from "../../../../../types/paths/repos/{owner}/{repo}/releases/latest.types.js";

export const GET: reposGetLatestRelease = async ($) => {
  const { owner, repo } = $.path;
  if (!$.context.hasRepository(owner, repo)) {
    return $.response[404].json({ message: "Not Found" });
  }
  const latest = $.context.getLatestRelease(owner, repo);
  if (!latest) {
    return $.response[404].json({ message: "Not Found" });
  }
  return $.response[200].json(latest);
};
