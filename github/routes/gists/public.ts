import type { gistsListPublic } from "../../types/paths/gists/public.types.js";

export const GET: gistsListPublic = async ($) => {
  return $.response[200].json($.context.listPublicGists());
};
