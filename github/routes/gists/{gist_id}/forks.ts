import type { gistsListForks } from "../../../types/paths/gists/{gist_id}/forks.types.js";
import type { gistsFork } from "../../../types/paths/gists/{gist_id}/forks.types.js";

export const GET: gistsListForks = async ($) => {
  return $.response[200].random();
};

export const POST: gistsFork = async ($) => {
  return $.response[201].random();
};
