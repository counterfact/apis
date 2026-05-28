import type { gitGetTag } from "../../../../../../types/paths/repos/{owner}/{repo}/git/tags/{tag_sha}.types.js";

export const GET: gitGetTag = async ($) => {
  return $.response[200].random();
};
