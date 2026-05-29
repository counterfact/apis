import type { reactionsListForRelease } from "../../../../../../types/paths/repos/{owner}/{repo}/releases/{release_id}/reactions.types.js";
import type { reactionsCreateForRelease } from "../../../../../../types/paths/repos/{owner}/{repo}/releases/{release_id}/reactions.types.js";

export const GET: reactionsListForRelease = async ($) => {
  return $.response[200].random();
};

export const POST: reactionsCreateForRelease = async ($) => {
  return $.response[200].random();
};
