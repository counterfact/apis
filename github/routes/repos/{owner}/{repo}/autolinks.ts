import type { reposListAutolinks } from "../../../../types/paths/repos/{owner}/{repo}/autolinks.types.js";
import type { reposCreateAutolink } from "../../../../types/paths/repos/{owner}/{repo}/autolinks.types.js";

export const GET: reposListAutolinks = async ($) => {
  return $.response[200].random();
};

export const POST: reposCreateAutolink = async ($) => {
  return $.response[201].random();
};
