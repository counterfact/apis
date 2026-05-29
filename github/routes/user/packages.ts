import type { packagesListPackagesForAuthenticatedUser } from "../../types/paths/user/packages.types.js";

export const GET: packagesListPackagesForAuthenticatedUser = async ($) => {
  return $.response[200].random();
};
