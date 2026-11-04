import type { metaGet } from "../types/paths/meta.types.js";

export const GET: metaGet = async ($) => {
  return $.response[200].json($.context.getApiOverview());
};
