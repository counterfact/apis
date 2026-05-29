import type { gistsListCommits } from "../../../types/paths/gists/{gist_id}/commits.types.js";

export const GET: gistsListCommits = async ($) => {
  return $.response[200].random();
};
