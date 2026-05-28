import type { appsListReposAccessibleToInstallation } from "../../types/paths/installation/repositories.types.js";

export const GET: appsListReposAccessibleToInstallation = async ($) => {
  return $.response[200].random();
};
