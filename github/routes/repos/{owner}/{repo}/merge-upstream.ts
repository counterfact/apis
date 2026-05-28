import type { reposMergeUpstream } from "../../../../types/paths/repos/{owner}/{repo}/merge-upstream.types.js";

export const POST: reposMergeUpstream = async ($) => {
  return $.response[200].random();
};
