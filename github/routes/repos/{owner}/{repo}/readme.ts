import type { reposGetReadme } from "../../../../types/paths/repos/{owner}/{repo}/readme.types.js";

export const GET: reposGetReadme = async ($) => {
  const readme = $.context.getRepositoryReadme($.path.owner, $.path.repo);
  if (!readme) {
    return $.response[404].empty();
  }
  return $.response[200].json(readme);
};
