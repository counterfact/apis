import type { appsGetAuthenticated } from "../types/paths/app.types.js";

export const GET: appsGetAuthenticated = async ($) => {
  return $.response[200].random();
};
