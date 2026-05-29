import type { reposCodeownersErrors } from "../../../../../types/paths/repos/{owner}/{repo}/codeowners/errors.types.js";

export const GET: reposCodeownersErrors = async ($) => {
  return $.response[200].random();
};
