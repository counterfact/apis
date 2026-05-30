import type { reposGetReleaseByTag } from "../../../../../../types/paths/repos/{owner}/{repo}/releases/tags/{tag}.types.js";

export const GET: reposGetReleaseByTag = async ($) => {
  const { owner, repo, tag } = $.path;
  if (!$.context.hasRepository(owner, repo)) {
    return $.response[404].json({ message: "Not Found" });
  }
  const found = $.context.getReleaseByTag(owner, repo, tag);
  if (!found) {
    return $.response[404].json({ message: "Not Found" });
  }
  return $.response[200].json(found);
};
