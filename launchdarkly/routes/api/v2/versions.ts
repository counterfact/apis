import type { getVersions } from "../../../types/paths/api/v2/versions.types.js";

export const GET: getVersions = async ($) => {
  return $.response[200].random();
};
