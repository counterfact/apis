import type { reposListTags } from "../../../../types/paths/repos/{owner}/{repo}/tags.types.js";

export const GET: reposListTags = async ($) => {
  return $.response[200].random();
};
