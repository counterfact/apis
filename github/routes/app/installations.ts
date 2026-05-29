import type { appsListInstallations } from "../../types/paths/app/installations.types.js";

export const GET: appsListInstallations = async ($) => {
  return $.response[200].random();
};
