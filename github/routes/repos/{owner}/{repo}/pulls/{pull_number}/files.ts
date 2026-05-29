import type { pullsListFiles } from "../../../../../../types/paths/repos/{owner}/{repo}/pulls/{pull_number}/files.types.js";

export const GET: pullsListFiles = async ($) => {
  return $.response[200].random();
};
