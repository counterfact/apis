import type { reposDownloadZipballArchive } from "../../../../../types/paths/repos/{owner}/{repo}/zipball/{ref}.types.js";

export const GET: reposDownloadZipballArchive = async ($) => {
  return $.response[302].empty();
};
