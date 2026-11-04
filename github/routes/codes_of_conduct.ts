import type { codesOfConductGetAllCodesOfConduct } from "../types/paths/codes_of_conduct.types.js";

export const GET: codesOfConductGetAllCodesOfConduct = async ($) => {
  return $.response[200].json($.context.listCodesOfConduct());
};
