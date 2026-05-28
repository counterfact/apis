import type { reposGetCommit } from "../../../../../types/paths/repos/{owner}/{repo}/commits/{ref}.types.js";

export const GET: reposGetCommit = async ($) => {
  return $.response[200].random();
};
