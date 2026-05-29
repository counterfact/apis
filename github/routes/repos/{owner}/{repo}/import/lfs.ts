import type { migrationsSetLfsPreference } from "../../../../../types/paths/repos/{owner}/{repo}/import/lfs.types.js";

export const PATCH: migrationsSetLfsPreference = async ($) => {
  return $.response[200].random();
};
