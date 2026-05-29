import type { migrationsGetImportStatus } from "../../../../types/paths/repos/{owner}/{repo}/import.types.js";
import type { migrationsStartImport } from "../../../../types/paths/repos/{owner}/{repo}/import.types.js";
import type { migrationsUpdateImport } from "../../../../types/paths/repos/{owner}/{repo}/import.types.js";
import type { migrationsCancelImport } from "../../../../types/paths/repos/{owner}/{repo}/import.types.js";

export const GET: migrationsGetImportStatus = async ($) => {
  return $.response[200].random();
};

export const PUT: migrationsStartImport = async ($) => {
  return $.response[201].random();
};

export const PATCH: migrationsUpdateImport = async ($) => {
  return $.response[200].random();
};

export const DELETE: migrationsCancelImport = async ($) => {
  return $.response[204].empty();
};
