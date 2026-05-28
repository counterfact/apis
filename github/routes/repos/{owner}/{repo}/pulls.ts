import type { pullsList } from "../../../../types/paths/repos/{owner}/{repo}/pulls.types.js";
import type { pullsCreate } from "../../../../types/paths/repos/{owner}/{repo}/pulls.types.js";

export const GET: pullsList = async ($) => {
  return $.response[200].random();
};

export const POST: pullsCreate = async ($) => {
  return $.response[201].random();
};
