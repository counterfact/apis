import type { gistsGet } from "../../types/paths/gists/{gist_id}.types.js";
import type { gistsUpdate } from "../../types/paths/gists/{gist_id}.types.js";
import type { gistsDelete } from "../../types/paths/gists/{gist_id}.types.js";

export const GET: gistsGet = async ($) => {
  return $.response[200].random();
};

export const PATCH: gistsUpdate = async ($) => {
  return $.response[200].random();
};

export const DELETE: gistsDelete = async ($) => {
  return $.response[204].empty();
};
