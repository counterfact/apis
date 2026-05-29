import type { checksListSuitesForRef } from "../../../../../../types/paths/repos/{owner}/{repo}/commits/{ref}/check-suites.types.js";

export const GET: checksListSuitesForRef = async ($) => {
  return $.response[200].random();
};
