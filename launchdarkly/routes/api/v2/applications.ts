import type { getApplications } from "../../../types/paths/api/v2/applications.types.js";

export const GET: getApplications = async ($) => {
  return $.response[200].random();
};
