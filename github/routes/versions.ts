import type { metaGetAllVersions } from "../types/paths/versions.types.js";

export const GET: metaGetAllVersions = async ($) => {
  return $.response[200].random();
};
