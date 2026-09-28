import type { getExtinctions } from "../../../../types/paths/api/v2/code-refs/extinctions.types.js";

export const GET: getExtinctions = async ($) => {
  return $.response[200].random();
};
