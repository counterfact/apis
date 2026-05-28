import type { gitListMatchingRefs } from "../../../../../../types/paths/repos/{owner}/{repo}/git/matching-refs/{ref}.types.js";

export const GET: gitListMatchingRefs = async ($) => {
  return $.response[200].random();
};
