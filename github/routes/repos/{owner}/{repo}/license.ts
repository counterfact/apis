import type { licensesGetForRepo } from "../../../../types/paths/repos/{owner}/{repo}/license.types.js";

export const GET: licensesGetForRepo = async ($) => {
  return $.response[200].random();
};
