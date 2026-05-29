import type { reposGetRelease } from "../../../../../types/paths/repos/{owner}/{repo}/releases/{release_id}.types.js";
import type { reposUpdateRelease } from "../../../../../types/paths/repos/{owner}/{repo}/releases/{release_id}.types.js";
import type { reposDeleteRelease } from "../../../../../types/paths/repos/{owner}/{repo}/releases/{release_id}.types.js";

export const GET: reposGetRelease = async ($) => {
  const { owner, repo, release_id } = $.path;
  if (!$.context.hasRepository(owner, repo)) {
    return $.response[404].json({ message: "Not Found" });
  }
  const found = $.context.getRelease(owner, repo, Number(release_id));
  if (!found) {
    return $.response[404].json({ message: "Not Found" });
  }
  return $.response[200].json(found);
};

export const PATCH: reposUpdateRelease = async ($) => {
  const { owner, repo, release_id } = $.path;
  if (!$.context.hasRepository(owner, repo)) {
    return $.response[404].json({ message: "Not Found" });
  }
  const updated = $.context.updateRelease(
    owner,
    repo,
    Number(release_id),
    $.body,
  );
  if (!updated) {
    return $.response[404].json({ message: "Not Found" });
  }
  return $.response[200].json(updated);
};

export const DELETE: reposDeleteRelease = async ($) => {
  const { owner, repo, release_id } = $.path;
  if (!$.context.hasRepository(owner, repo)) {
    return $.response[404].json({ message: "Not Found" });
  }
  $.context.deleteRelease(owner, repo, Number(release_id));
  return $.response[204].empty();
};
