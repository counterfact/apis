import type { appsGetUserInstallation } from "../../../types/paths/users/{username}/installation.types.js";

export const GET: appsGetUserInstallation = async ($) => {
  return $.response[200].random();
};
