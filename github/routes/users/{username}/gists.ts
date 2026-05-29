import type { gistsListForUser } from "../../../types/paths/users/{username}/gists.types.js";

export const GET: gistsListForUser = async ($) => {
  return $.response[200].random();
};
