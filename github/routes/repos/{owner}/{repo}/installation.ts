import type { appsGetRepoInstallation } from "../../../../types/paths/repos/{owner}/{repo}/installation.types.js";

export const GET: appsGetRepoInstallation = async ($) => {
  return $.response[200].random();
};
