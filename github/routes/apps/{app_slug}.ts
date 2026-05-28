import type { appsGetBySlug } from "../../types/paths/apps/{app_slug}.types.js";

export const GET: appsGetBySlug = async ($) => {
  return $.response[200].random();
};
