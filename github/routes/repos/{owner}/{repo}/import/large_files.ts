import type { migrationsGetLargeFiles } from "../../../../../types/paths/repos/{owner}/{repo}/import/large_files.types.js";

export const GET: migrationsGetLargeFiles = async ($) => {
  return $.response[200].random();
};
