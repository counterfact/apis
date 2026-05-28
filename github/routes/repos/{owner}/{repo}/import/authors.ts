import type { migrationsGetCommitAuthors } from "../../../../../types/paths/repos/{owner}/{repo}/import/authors.types.js";

export const GET: migrationsGetCommitAuthors = async ($) => {
  return $.response[200].random();
};
