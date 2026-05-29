import type { reposGetReleaseByTag } from "../../../../../../types/paths/repos/{owner}/{repo}/releases/tags/{tag}.types.js";

export const GET: reposGetReleaseByTag = async ($) => {
  return $.response[200].random();
};
