import type { reposDownloadTarballArchive } from "../../../../../types/paths/repos/{owner}/{repo}/tarball/{ref}.types.js";

export const GET: reposDownloadTarballArchive = async ($) => {
  return $.response[302].empty();
};
