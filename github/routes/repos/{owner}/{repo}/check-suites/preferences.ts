import type { checksSetSuitesPreferences } from "../../../../../types/paths/repos/{owner}/{repo}/check-suites/preferences.types.js";

export const PATCH: checksSetSuitesPreferences = async ($) => {
  return $.response[200].random();
};
