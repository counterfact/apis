import type { licensesGet } from "../../types/paths/licenses/{license}.types.js";

export const GET: licensesGet = async ($) => {
  const license = $.context.getLicense($.path.license);
  if (!license) {
    return $.response[404].empty();
  }

  return $.response[200].json(license);
};
