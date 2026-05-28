import type { codesOfConductGetConductCode } from "../../types/paths/codes_of_conduct/{key}.types.js";

export const GET: codesOfConductGetConductCode = async ($) => {
  return $.response[200].random();
};
