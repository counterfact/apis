import type { checksCreateSuite } from "../../../../types/paths/repos/{owner}/{repo}/check-suites.types.js";

export const POST: checksCreateSuite = async ($) => {
  return $.response[200].random();
};
