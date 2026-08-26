import type { getApplicationVersions } from "../../../../../types/paths/api/v2/applications/{applicationKey}/versions.types.js";

export const GET: getApplicationVersions = async ($) => {
  return $.response[200].random();
};
