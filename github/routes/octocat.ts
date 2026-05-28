import type { metaGetOctocat } from "../types/paths/octocat.types.js";

export const GET: metaGetOctocat = async ($) => {
  return $.response[200].random();
};
