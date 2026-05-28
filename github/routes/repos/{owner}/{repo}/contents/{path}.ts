import type { reposGetContent } from "../../../../../types/paths/repos/{owner}/{repo}/contents/{path}.types.js";
import type { reposCreateOrUpdateFileContents } from "../../../../../types/paths/repos/{owner}/{repo}/contents/{path}.types.js";
import type { reposDeleteFile } from "../../../../../types/paths/repos/{owner}/{repo}/contents/{path}.types.js";

export const GET: reposGetContent = async ($) => {
  return $.response[200].random();
};

export const PUT: reposCreateOrUpdateFileContents = async ($) => {
  return $.response[200].random();
};

export const DELETE: reposDeleteFile = async ($) => {
  return $.response[200].random();
};
