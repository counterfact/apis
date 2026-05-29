import type { reposGetAutolink } from "../../../../../types/paths/repos/{owner}/{repo}/autolinks/{autolink_id}.types.js";
import type { reposDeleteAutolink } from "../../../../../types/paths/repos/{owner}/{repo}/autolinks/{autolink_id}.types.js";

export const GET: reposGetAutolink = async ($) => {
  return $.response[200].random();
};

export const DELETE: reposDeleteAutolink = async ($) => {
  return $.response[204].empty();
};
