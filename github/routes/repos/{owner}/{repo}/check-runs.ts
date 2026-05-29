import type { checksCreate } from "../../../../types/paths/repos/{owner}/{repo}/check-runs.types.js";

export const POST: checksCreate = async ($) => {
  return $.response[201].random();
};
