import type { migrationsMapCommitAuthor } from "../../../../../../types/paths/repos/{owner}/{repo}/import/authors/{author_id}.types.js";

export const PATCH: migrationsMapCommitAuthor = async ($) => {
  return $.response[200].random();
};
