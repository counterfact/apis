import type { checksListForRef } from "../../../../../../types/paths/repos/{owner}/{repo}/commits/{ref}/check-runs.types.js";

export const GET: checksListForRef = async ($) => {
  return $.response[200].random();
};
