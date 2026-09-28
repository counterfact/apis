import type { getBranches } from "../../../../../../types/paths/api/v2/code-refs/repositories/{repo}/branches.types.js";

export const GET: getBranches = async ($) => {
  return $.response[200].random();
};
