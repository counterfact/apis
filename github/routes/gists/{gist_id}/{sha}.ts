import type { gistsGetRevision } from "../../../types/paths/gists/{gist_id}/{sha}.types.js";

export const GET: gistsGetRevision = async ($) => {
  return $.response[200].random();
};
