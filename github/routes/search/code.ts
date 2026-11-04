import type { searchCode } from "../../types/paths/search/code.types.js";

export const GET: searchCode = async ($) => {
  return $.response[200].json($.context.searchCode($.query));
};
