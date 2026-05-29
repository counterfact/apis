import type { reposListReleases } from "../../../../types/paths/repos/{owner}/{repo}/releases.types.js";
import type { reposCreateRelease } from "../../../../types/paths/repos/{owner}/{repo}/releases.types.js";

export const GET: reposListReleases = async ($) => {
  return $.response[200].random();
};

export const POST: reposCreateRelease = async ($) => {
  return $.response[201].random();
};
