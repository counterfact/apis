import type { reposListLanguages } from "../../../../types/paths/repos/{owner}/{repo}/languages.types.js";

export const GET: reposListLanguages = async ($) => {
  return $.response[200].random();
};
