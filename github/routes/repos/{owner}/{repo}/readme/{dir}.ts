import type { reposGetReadmeInDirectory } from "../../../../../types/paths/repos/{owner}/{repo}/readme/{dir}.types.js";

export const GET: reposGetReadmeInDirectory = async ($) => {
  return $.response[200].random();
};
