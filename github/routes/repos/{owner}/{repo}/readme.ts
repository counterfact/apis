import type { reposGetReadme } from "../../../../types/paths/repos/{owner}/{repo}/readme.types.js";

export const GET: reposGetReadme = async ($) => {
  return $.response[200].random();
};
